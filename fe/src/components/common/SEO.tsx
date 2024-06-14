import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string | '';
  metaDescription?: string | undefined;
  metaKeywords?: string | undefined;
}

const Seo = ({ title, metaDescription, metaKeywords }: SeoProps) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Viblo` : "Viblo"}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {metaDescription && (
        <meta property="og:description" content={metaDescription} />
      )}
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <meta
        property="og:title"
        content={title ? `${title} | Viblo` : "Viblo"}
      />
      <meta property="og:site_name" content="Viblo" />
    </Helmet>
  );
};

export default Seo;
