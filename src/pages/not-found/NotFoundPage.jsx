import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function NotFoundPage() {
  return <section className="not-found-page" aria-labelledby="not-found-title">
    <div className="not-found-orbit" aria-hidden="true"><span>404</span><AutoAwesomeIcon /></div>
    <p className="eyebrow"><SearchOffOutlinedIcon /> KYREONS / PAGE NOT FOUND</p>
    <h1 id="not-found-title">Looks like this<br /><span>piece is missing.</span></h1>
    <p className="not-found-copy">The page you’re looking for may have moved or is no longer here.</p>
    <div className="not-found-actions">
      <a className="not-found-primary" href="#shop">EXPLORE THE SHOP <ArrowOutwardIcon /></a>
      <a className="not-found-home" href="#home"><HomeOutlinedIcon /> BACK HOME</a>
    </div>
    <span className="not-found-index">KYREONS® — FIND YOUR OWN WAY</span>
  </section>;
}
