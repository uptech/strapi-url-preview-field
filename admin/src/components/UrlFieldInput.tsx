import * as React from 'react';
import { useState, useEffect } from 'react';

import {
  Box,
  Field,
  Flex,
  Typography,
  Loader,
} from '@strapi/design-system';
import { ExternalLink, Globe } from '@strapi/icons';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

type UrlFieldInputProps = InputProps & {
  labelAction?: React.ReactNode;
  attribute?: {
    options?: {
      url?: string;
    };
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

type UrlMetadata = {
  title?: string;
  image?: string;
  url?: string;
  domain?: string;
  description?: string;
};

const PreviewCard = styled(Box)`
  border: 1px solid #e4e7eb;
  border-radius: 4px;
  max-width: 400px;
  margin-top: 8px;
  padding: 16px;
  background: white;
`;

const UrlPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 12px;
`;

const PreviewTitle = styled(Typography)`
  font-size: 1.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 8px;
`;

const PreviewLink = styled.a`
  color: #0099e5;
  text-decoration: underline;
  font-weight: 500;
  font-size: 1rem;
  margin-top: 8px;
  display: inline-block;
`;

const UrlFieldInput = React.forwardRef<HTMLButtonElement, UrlFieldInputProps>(
  ({ hint, disabled, labelAction, label, name, required, attribute, onChange, error, ...props }, forwardedRef) => {
    const { value } = useField(name);
    const [inputValue, setInputValue] = useState(value || '');
    const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Function to fetch URL metadata using the server API
    const fetchUrlMetadata = async (url: string) => {
      if (!url || url.trim() === '') {
        setMetadata(null);
        setFetchError(null);
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        const response = await fetch('/url-preview-field/url-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`Metadata fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Metadata received:', JSON.stringify(data));
        setMetadata(data);
      } catch (err) {
        console.error('Error fetching URL metadata:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setFetchError(`Failed to fetch URL metadata: ${errorMessage}`);
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    // Debounced URL fetching
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (inputValue) {
          fetchUrlMetadata(inputValue);
        } else {
          setMetadata(null);
          setFetchError(null);
        }
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }, [inputValue]);

    // Keep inputValue in sync with form value
    useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      
      // Also update the field value for Strapi
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Flex direction="column" alignItems="stretch" gap={2}>
          <Field.Label action={labelAction}>{label}</Field.Label>
          
          <Field.Input 
            type="url" 
            placeholder="https://example.com"
            value={inputValue}
            onChange={handleChange}
            disabled={disabled}
          />

          {/* Loading state */}
          {loading && (
            <Flex alignItems="center" gap={2}>
              <Loader small />
              <Typography variant="pi">Fetching preview...</Typography>
            </Flex>
          )}

          {/* Error state */}
          {fetchError && (
            <Typography variant="pi" textColor="danger600">
              {fetchError}
            </Typography>
          )}

          {/* Social Share Card Preview */}
          {metadata && !loading && !fetchError && (
            <PreviewCard>
              <Flex direction="column" gap={3} alignItems="flex-start">
                {/* URL and domain */}
                <UrlPreview>
                  <Globe width="12" height="12" />
                  <Typography variant="pi">{metadata.domain}</Typography>
                </UrlPreview>

                {/* Image */}
                {metadata.image && (
                  <PreviewImage 
                    src={metadata.image} 
                    alt={metadata.title}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                {/* Title */}
                {metadata.title && (
                  <PreviewTitle as="div">{metadata.title}</PreviewTitle>
                )}

                {/* Link */}
                {metadata.url && (
                  <PreviewLink
                    href={metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on {metadata.domain} &gt;
                  </PreviewLink>
                )}
              </Flex>
            </PreviewCard>
          )}
        </Flex>
      </Field.Root>
    );
  }
);

export { UrlFieldInput };