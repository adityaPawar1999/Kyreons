import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BrandLogo from './BrandLogo.jsx';

export default function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand-block"><BrandLogo className="footer-logo" /><p>Every day is a chance to be a little bit more you.</p><div className="footer-social"><a href="https://www.instagram.com/kyreons_/" target="_blank" rel="noreferrer" aria-label="Instagram: kyreons_"><InstagramIcon /><span>kyreons_</span></a><a href="https://www.facebook.com/kyreons" target="_blank" rel="noreferrer" aria-label="Facebook: kyreons.fb"><FacebookIcon /><span>kyreons.fb</span></a><a href="mailto:kyreons.studio@gmail.com" aria-label="Email kyreons.studio@gmail.com"><EmailOutlinedIcon /><span>kyreons.studio@gmail.com</span></a></div></div><div className="footer-column"><h2>EXPLORE</h2><a href="#home">Home</a><a href="#shirts">Shop all shirts</a><a href="#category/oversized">Oversized</a><a href="#category/handcrafted">Handcrafted</a></div><div className="footer-column"><h2>YOUR KYREONS</h2><a href="#wishlist">Wishlist</a><a href="#contact">Contact us</a><a href="#our-story">Our story</a><a href="#shop">Find your fit</a></div><div className="footer-note"><span>MADE FOR THE IN-BETWEEN</span><p>Inspired by Seoul, Tokyo and everywhere in between. Designed to feel like your own.</p><a href="#shirts">FIND YOUR NEXT FAVOURITE <ArrowOutwardIcon /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} KYREONS. MADE FOR YOUR OWN WORLD.</span><div><a href="#contact">CONTACT</a><a href="#home">BACK TO TOP <ArrowUpwardIcon /></a></div></div></footer>;
}
