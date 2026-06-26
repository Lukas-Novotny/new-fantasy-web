# New Fantasy – Cafe & Restaurant

Premium restaurant website for **Cafe-Restaurant New Fantasy**, Praha–Libuš.

- **Tech stack:** Pure HTML · Pure CSS · Vanilla JavaScript — zero frameworks, zero dependencies
- **CMS:** Decap CMS (formerly Netlify CMS) — edits only the daily lunch menu
- **Hosting:** Netlify (static site)

---

## Project Structure

```
/
├── index.html              ← Main page (all sections)
├── css/
│   └── style.css           ← All styles (responsive, animations)
├── js/
│   └── main.js             ← Navigation, gallery lightbox, menu fetch, animations
├── assets/
│   ├── images/             ← Place real restaurant photos here
│   └── icons/
│       └── favicon.svg     ← SVG favicon (NF monogram)
├── admin/
│   ├── index.html          ← Decap CMS admin panel
│   └── config.yml          ← CMS configuration
├── content/
│   └── menu.json           ← Daily lunch menu data (edited via CMS)
├── netlify.toml            ← Netlify build & headers config
├── _redirects              ← Netlify redirects
├── robots.txt              ← SEO crawler rules
└── sitemap.xml             ← SEO sitemap
```

---

## Deploy to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit – New Fantasy website"
gh repo create new-fantasy-web --public --source=. --push
```

### 2. Connect to Netlify

1. Go to [netlify.com](https://www.netlify.com) → **Add new site** → **Import from Git**
2. Select your GitHub repository
3. Build settings are auto-detected from `netlify.toml`
4. Click **Deploy site**

### 3. Set Custom Domain

1. Netlify Dashboard → **Domain management**
2. Add `www.newfantasy.cz`
3. Update DNS records at your registrar as instructed by Netlify
4. Wait for SSL certificate (automatic, free via Let's Encrypt)

---

## Enable Netlify Identity (for CMS login)

1. Netlify Dashboard → **Identity** tab
2. Click **Enable Identity**
3. Under **Registration preferences** → set to **Invite only**
4. Invite yourself: enter your email → **Send invite**
5. Check your email and complete registration

---

## Enable Git Gateway (for CMS to commit)

1. Netlify Dashboard → **Identity** → scroll to **Services**
2. Click **Enable Git Gateway**
3. This allows Decap CMS to commit directly to your GitHub repository

---

## How to Edit the Lunch Menu

1. Go to `https://www.newfantasy.cz/admin/`
2. Log in with your Netlify Identity credentials
3. Click **"Denní menu"** in the left sidebar
4. Click **"Dnešní polední menu"**
5. Update the date, soup, and main courses
6. Click **Save** (top right)
7. Wait ~30 seconds for Netlify to rebuild and deploy

The homepage reads `content/menu.json` automatically via JavaScript.

---

## How to Update Images

The site uses Unsplash images as premium placeholders. To replace them with real restaurant photos:

1. Place your photos in `/assets/images/`
2. In `index.html`, replace Unsplash URLs with your local paths:
   - Hero: find `class="hero-bg"` → change `src="https://images.unsplash.com/..."`
   - About: find `class="about-img-main"` → change src
   - Dishes: find each `class="dish-card"` → change src
   - Gallery: find each `class="gallery-item"` → change both `src` and `data-src`

**Recommended image sizes:**
| Use | Min size |
|-----|----------|
| Hero background | 1920×1080px |
| About main image | 800×900px |
| Dish photos | 700×520px |
| Gallery | 800×600px or taller |

**Supported formats:** JPEG, WebP (preferred for performance), PNG

---

## SEO

- Title, description, Open Graph, and Twitter Card are in `<head>` of `index.html`
- JSON-LD structured data (Restaurant schema) is included
- `robots.txt` and `sitemap.xml` are in the root
- Update `sitemap.xml` → change `<lastmod>` date when you deploy

---

## Performance

- All images are `loading="lazy"` (except hero)
- Google Fonts are preconnected
- CSS is a single file (no render blocking)
- JS is `defer` (non-blocking)
- Intersection Observer for scroll animations
- Menu JSON is cached for 1 hour via Netlify headers

---

## Contact

**Cafe-Restaurant New Fantasy**  
U Pejřárny 1044/1a, 142 00 Praha 4 – Libuš  
Tel: +420 727 973 354  
Email: newfantasy@seznam.cz  
Web: https://www.newfantasy.cz
