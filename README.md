# Subhash Dubey — Motion Graphics Portfolio

A premium, responsive portfolio website for **Subhash Dubey — Senior Motion Graphics Designer & Video Editor**.

## What is included

- Premium dark broadcast/editorial visual identity
- Poppins typography throughout
- Animated hero with camera/viewfinder treatment
- About, Skills, Featured Work and Contact sections
- Behance portfolio button
- YouTube showreel button
- Project lightbox
- **Upload Project Image** directly from the live page
- **+ Add Project** form for new work
- Mobile responsive navigation
- No build step — plain HTML, CSS and JavaScript
- Ready for GitHub Pages

## Folder structure

```text
/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
```

## Personal links

Open `script.js` and edit the `CONFIG` object at the top. Your Behance profile is already connected:

`https://www.behance.net/subhashdubey`

Replace the YouTube, LinkedIn and Instagram values with your real profiles.

## Add project images

### Quick preview method
Click **Upload Project Image** on any project card. The selected image is stored in that browser using localStorage, so it is useful for previewing the website.

### Permanent GitHub method
Put your image inside `images/`, then set the project's image path in `CONFIG.defaultProjects`:

```js
image: "images/my-project.jpg"
```

For permanent hosting, JPG, PNG or WebP files are recommended.

## Deploy on GitHub Pages

1. Create a new GitHub repository, for example `subhash-portfolio`.
2. Upload `index.html`, `style.css`, `script.js`, `README.md` and the `images` folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**.
6. Save.

Your site will be available at:

`https://YOUR-USERNAME.github.io/subhash-portfolio/`

## Important

The browser upload feature is local to the visitor's browser. It does **not** upload images into GitHub. To make an image permanent for every visitor, add it to the `images/` folder and reference it from `script.js`.
