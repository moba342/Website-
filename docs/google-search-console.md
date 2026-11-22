# Google Search Console setup

Property: `https://buyaws-account.vercel.app/` (URL-prefix property).

## HTML-file ownership verification

The owner supplied the Google verification content:

```text
google-site-verification: googlee9c6c6adb26b90ba.html
```

The source file is `public/googlee9c6c6adb26b90ba.html`. It is copied into the site root during the Vite build and must be publicly available at:

https://buyaws-account.vercel.app/googlee9c6c6adb26b90ba.html

Keep this file in the project so Google can continue checking ownership. This is an HTML-file verification method, not a verification meta tag.

After the file is deployed, open the matching property in Google Search Console and click **Verify** under the HTML-file method. Publishing the file does not itself confirm that Google has verified the property.

## Submit the sitemap

After ownership is verified, open **Sitemaps**, enter `sitemap_index.xml`, and submit. The index is published at:

https://buyaws-account.vercel.app/sitemap_index.xml

The index references separate page, provider, and product sitemaps covering the current 74 indexable routes. `robots.txt` also points to the same sitemap index. Search Console property verification and sitemap submission require the owner's signed-in Google account; no Google password, OAuth token, or private credential belongs in this repository.

Official verification guide: https://support.google.com/webmasters/answer/9008080
