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

const UrlFieldInput = React.forwardRef<HTMLButtonElement, UrlFieldInputProps>(
  ({ hint, disabled, labelAction, label, name, required, attribute, onChange, error, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useState('');
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
        console.log('Fetching metadata for:', url);
        // const response = await fetch('/admin/url-metadata', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ url }),
        // });

        // if (!response.ok) {
        //   throw new Error(`Metadata fetch failed: ${response.status} ${response.statusText}`);
        // }

        // const data = await response.json();
        // console.log('Metadata received:', data);
        // setMetadata(data.metadata);
        setMetadata({
          title: `Seeing Lady Gaga at San Francisco's Chase Center This Week? From Bag Policy to Parking, What to Know`,
          image: `https://cdn.kqed.org/wp-content/uploads/sites/10/2025/07/Lady-Gaga-Mayhem-Tour-SF-1.png`,
          url: url,
          domain: 'kqed.org',
        });
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
            placeholder="https://example.com/article"
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
              <Flex direction="column" gap={3}>
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
                <Typography variant="pi" fontWeight="bold" textColor="black">
                  {metadata.title}
                </Typography>

                
              </Flex>
            </PreviewCard>
          )}
        </Flex>
      </Field.Root>
    );
  }
);

export { UrlFieldInput };