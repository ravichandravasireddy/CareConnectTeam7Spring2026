import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import PageMeta from './PageMeta';

const renderWithHelmet = (ui) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe('PageMeta', () => {
  it('sets document title', () => {
    renderWithHelmet(<PageMeta title="Test Page" description="Test" path="/test" />);
    expect(document.title).toBe('Test Page');
  });

  it('sets meta description', () => {
    renderWithHelmet(<PageMeta title="T" description="Test description" path="/" />);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).toHaveAttribute('content', 'Test description');
  });

  it('sets canonical link when path provided', () => {
    renderWithHelmet(<PageMeta title="T" description="D" path="/about" />);
    const link = document.querySelector('link[rel="canonical"]');
    expect(link).toHaveAttribute('href', expect.stringContaining('/about'));
  });

  it('sets Open Graph title', () => {
    renderWithHelmet(<PageMeta title="OG Title" description="D" path="/" />);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).toHaveAttribute('content', 'OG Title');
  });

  it('uses siteUrl only when path is not provided', () => {
    renderWithHelmet(<PageMeta title="T" description="D" />);
    const link = document.querySelector('link[rel="canonical"]');
    expect(link).toHaveAttribute('href', expect.stringMatching(/^https?:\/\/[^/]+$/));
  });
});
