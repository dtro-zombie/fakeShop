import { Helmet } from 'react-helmet-async'

const SEO = ({ title, description, keywords }) => (
  <Helmet>
    <title>{title} | FakeShop</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    {/* OpenGraph tags (opcional) */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {/* Favicon (ajusta la ruta) */}
    <link rel="icon" href="/favicon.ico" />
    {/* Font Awesome (mejor que en el HTML) */}
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      crossOrigin="anonymous"
    />
  </Helmet>
)

export default SEO