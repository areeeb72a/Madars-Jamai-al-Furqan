# Madars Jamai-al-Furqan — F-1: Modular Split

Wahi app, wahi behaviour — sirf structure badla hai. Ek 3,316-line index.html ab 5 files hai:

```
index.html            markup + Tailwind config (inline rehna zaroori)
css/custom.css        base styles
js/translations.js    اردو / العربية / English dictionaries
js/app-core.js        state + demo data + language/role/tab switching
js/render.js          render engine + modals + init
```

Load order matters: translations → app-core → render (index.html mein pehle se sahi tarteeb hai).

## Deploy (GitHub web upload)

1. GitHub → `areeeb72a/Madars-Jamai-al-Furqan` → "Add file → Upload files"
2. Is folder ka poora content drag karo (js/ aur css/ folders samet — folders drag karne se paths khud ban jate hain)
3. Purani index.html overwrite ho jayegi → Commit
4. Vercel khud redeploy karega (1–2 minute)

## Deploy ke baad check

- Site kholo → console mein koi error na ho (Tailwind CDN ka warning aayega, wo abhi normal hai)
- اردو / العربية / English teeno buttons chala kar dekho
- Har tab kholo, ek donation add karke dekho

Koi masla ho to purani index.html wapas upload kar do — rollback bas itna hai.
