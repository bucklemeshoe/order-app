"use client"

import { useEffect, useMemo, useState } from "react"
import type { MenuItem } from "@/types/menu"
import { loadItems } from "@/lib/storage"
import { Montserrat, Lora } from "next/font/google"

// Fonts (match HTML: Montserrat body, Lora headings)
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-lora" })

type PricePair = { short?: number; tall?: number }

function formatR(price?: number) {
  if (price == null || Number.isNaN(price)) return "-"
  return `R ${price.toFixed(2)}`
}

function getPair(it: MenuItem): PricePair {
  const short = it.variants.find((v) => v.name.toLowerCase() === "short")?.price
  const tall = it.variants.find((v) => v.name.toLowerCase() === "tall")?.price
  return { short, tall }
}

function getVariantPrice(it: MenuItem, name: string) {
  return it.variants.find((v) => v.name.toLowerCase() === name.toLowerCase())?.price
}

export default function DisplayMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Load from the same storage as Menu Builder and listen to updates
  useEffect(() => {
    setItems(loadItems())
    const t = (window.localStorage.getItem("menuTheme") as "light" | "dark") || "light"
    setTheme(t)

    const onStorage = (e: StorageEvent) => {
      if (e.key === "menuTheme" && e.newValue) {
        setTheme(e.newValue as "light" | "dark")
      } else if (e.key === "coffee-menu-items-v2") {
        setItems(loadItems())
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Only show available items and keep order by position per section
  const byCategory = useMemo(() => {
    const map = new Map<string, MenuItem[]>()
    for (const it of items) {
      if (!it.available) continue
      const arr = map.get(it.category) ?? []
      arr.push(it)
      map.set(it.category, arr)
    }
    for (const [k, arr] of map) {
      arr.sort((a, b) => {
        const ap = typeof a.position === "number" ? a.position : 0
        const bp = typeof b.position === "number" ? b.position : 0
        if (ap !== bp) return ap - bp
        return a.name.localeCompare(b.name)
      })
      map.set(k, arr)
    }
    return map
  }, [items])

  const coffee = byCategory.get("Coffee") ?? []
  const lattes = byCategory.get("Lattes") ?? []
  const hotCold = byCategory.get("Hot or Cold") ?? []
  const milkshakes = byCategory.get("Milkshakes & Smoothies") ?? []
  const combos = byCategory.get("Combos") ?? []
  const extras = byCategory.get("Extras") ?? []
  const drinks = byCategory.get("Drinks") ?? []
  const karak =
    (byCategory.get("Specialty") ?? []).find((i) => i.name.toLowerCase().includes("green gold karak")) ??
    (byCategory.get("Specialty") ?? [])[0] ??
    null

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    window.localStorage.setItem("menuTheme", next)
  }

  return (
    <main className={`${montserrat.className} ${lora.variable}`}>
      <div className={`display-body ${theme === "dark" ? "dark-theme" : ""}`}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="menu-container">
          {/* Left Column */}
          <div className="section coffee">
            <h2 className="section-title">
              <span>COFFEE</span>
              <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
            </h2>
            <div className="section-content">
              <div className="price-table">
                <div className="price-header">
                  <div className="price-cell">Item</div>
                  <div className="price-cell">Short</div>
                  <div className="price-cell">Tall</div>
                </div>

                {coffee.map((it) => {
                  const pair = getPair(it)
                  return (
                    <div className="price-row" key={it.id}>
                      <div className="price-cell name">{it.name}</div>
                      <div className="price-cell price">{formatR(pair.short)}</div>
                      <div className="price-cell price">{formatR(pair.tall)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="section lattes">
            <h2 className="section-title">
              <span>{"LATTE'S"}</span>
              <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
            </h2>
            <div className="section-content">
              <div className="price-table">
                <div className="price-header">
                  <div className="price-cell">Item</div>
                  <div className="price-cell">Short</div>
                  <div className="price-cell">Tall</div>
                </div>

                {lattes.map((it) => {
                  const pair = getPair(it)
                  return (
                    <div className="price-row" key={it.id}>
                      <div className="price-cell name">{it.name}</div>
                      <div className="price-cell price">{formatR(pair.short)}</div>
                      <div className="price-cell price">{formatR(pair.tall)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="middle-column">
            <div className="section hot-cold">
              <h2 className="section-title">
                <span>HOT OR COLD</span>
                <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
              </h2>
              <div className="section-content">
                <div className="price-table">
                  <div className="price-header">
                    <div className="price-cell">Item</div>
                    <div className="price-cell">Short</div>
                    <div className="price-cell">Tall</div>
                  </div>

                  {hotCold.map((it) => {
                    const pair = getPair(it)
                    return (
                      <div className="price-row" key={it.id}>
                        <div className="price-cell name">{it.name}</div>
                        <div className="price-cell price">{formatR(pair.short)}</div>
                        <div className="price-cell price">{formatR(pair.tall)}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="specialty-drinks">
                  <h3
                    style={{
                      textAlign: "left",
                      margin: "12px 0",
                      fontFamily: "var(--font-lora), serif",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {"MILKSHAKES & SMOOTHIES"}
                  </h3>
                  <div className="specialty-price-table">
                    <div className="specialty-price-header">
                      <div className="price-cell">Item</div>
                      <div className="price-cell">500ml</div>
                    </div>

                    {milkshakes.map((it) => {
                      const p = getVariantPrice(it, "500ml")
                      return (
                        <div className="specialty-price-row" key={it.id}>
                          <div className="price-cell name">{it.name}</div>
                          <div className="price-cell price">{formatR(p)}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Karak Featured Block */}
            {karak ? (
              <div className="karak-block" style={{ gridRow: 2 as any }}>
                <div className="karak-content">
                  <div className="karak-header">
                    <div className="karak-name">{karak.name}</div>
                    <div className="karak-dot">{"•"}</div>
                    <div className="karak-price">
                      {`${karak.variants[0]?.name ?? ""} - ${formatR(karak.variants[0]?.price)}`}
                    </div>
                  </div>
                  <div className="karak-description">{karak.description}</div>
                </div>
                <img src="/saiy-coffee_karak-tea-min.png" alt="Green Gold Karak Tea" className="karak-image" />
              </div>
            ) : null}

            {/* Combos */}
            <div className="section snacks">
              <h2 className="section-title">
                <span>COMBOS</span>
                <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
              </h2>
              <div className="section-content">
                <div className="simple-header">
                  <div>Item</div>
                  <div>Price</div>
                </div>
                <div className="menu-items">
                  {combos.map((it) => (
                    <div className="menu-item" key={it.id}>
                      <div className="item-name">{it.name}</div>
                      <div className="price">{formatR(it.variants[0]?.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="section extras">
            <h2 className="section-title">
              <span>EXTRAS</span>
              <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
            </h2>
            <div className="section-content">
              <div className="simple-header">
                <div>Item</div>
                <div>Price</div>
              </div>
              <div className="menu-items">
                <div className="extras-list">
                  {extras.map((it) => (
                    <div className="menu-item" key={it.id}>
                      <div className="item-name">{it.name}</div>
                      <div className="price">{formatR(it.variants[0]?.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="section drinks">
            <h2 className="section-title">
              <span>DRINKS</span>
              <img src="/saiy-stars.png" alt="Stars" className="title-gif" />
            </h2>
            <div className="section-content">
              <div className="simple-header">
                <div>Item</div>
                <div>Price</div>
              </div>
              <div className="menu-items">
                <div className="extras-list">
                  {drinks.map((it) => (
                    <div className="menu-item" key={it.id}>
                      <div className="item-name">{it.name}</div>
                      <div className="price">{formatR(it.variants[0]?.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --bg-primary: #FAF6F0;
          --bg-secondary: #FAF6F0;
          --text-primary: #333;
          --text-secondary: #666;
          --text-muted: #666;
          --border-color: black;
          --border-secondary: black;
        }
        .dark-theme {
          --bg-primary: #1a1a1a;
          --bg-secondary: #2b2b2b;
          --text-primary: #e0e0e0;
          --text-secondary: #e0e0e0;
          --text-muted: #bbb;
          --border-color: #666;
          --border-secondary: #666;
        }
        .display-body {
          background: var(--bg-primary);
          width: 1920px;
          height: 1080px;
          overflow: hidden;
          color: var(--text-primary);
          position: relative;
          font-family: ${montserrat.style.fontFamily};
        }
        .menu-container {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          grid-template-rows: auto auto;
          gap: 10px;
          padding: 12px 12px;
          height: 100%;
          max-height: 1080px;
          box-sizing: border-box;
        }
        .section {
          background: var(--bg-secondary);
          border-radius: 0;
          padding: 12px;
          box-shadow: none;
          border: 1px solid var(--border-color);
          overflow: visible;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .section.coffee { grid-row: 1; grid-column: 1; }
        .section.lattes { grid-row: 2; grid-column: 1; }
        .middle-column {
          grid-row: 1 / 3;
          grid-column: 2;
          display: grid;
          grid-template-rows: auto auto auto;
          gap: 10px;
          min-height: 0;
        }
        .section.hot-cold { grid-row: 1; }
        .section.snacks { grid-row: 3; }
        .section.extras { grid-row: 1; grid-column: 3; }
        .section.drinks { grid-row: 2; grid-column: 3; }
        .section-title {
          font-family: var(--font-lora), serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 10px;
          padding-bottom: 4px;
          border-bottom: 2px solid var(--border-secondary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title-gif { width: 28px; height: 28px; object-fit: contain; }
        .section-content { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .menu-items { display: flex; flex-direction: column; flex: 1; gap: 2px; }
        .menu-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid var(--border-secondary); font-size: 0.95rem; min-height: 34px; }
        .menu-item:last-child { border-bottom: none; }
        .price-table { display: flex; flex-direction: column; }
        .price-header { display: grid; grid-template-columns: 2fr 80px 80px; padding: 6px 0; font-weight: 600; border-bottom: 1px solid var(--border-secondary); margin-bottom: 6px; text-align: right; font-size: 0.9rem; }
        .price-header .price-cell:first-child { text-align: left; }
        .price-row { display: grid; grid-template-columns: 2fr 80px 80px; padding: 4px 0; border-bottom: 1px solid var(--border-secondary); align-items: center; min-height: 34px; }
        .price-row:last-child { border-bottom: none; }
        .price-cell { padding: 2px 4px; }
        .price-cell.name { font-weight: 500; text-align: left; padding: 2px 4px 2px 8px; color: var(--text-primary); }
        .price-cell.price { font-weight: 600; text-align: right; padding: 2px 8px 2px 4px; color: var(--text-primary); }
        .karak-block {
          background: var(--bg-secondary);
          background-image:
            radial-gradient(circle at 25% 25%, rgba(210, 173, 46, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 75% 75%, rgba(244, 208, 63, 0.06) 0%, transparent 25%),
            radial-gradient(circle at 75% 25%, rgba(183, 149, 11, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 25% 75%, rgba(210, 173, 46, 0.07) 0%, transparent 25%),
            linear-gradient(45deg, transparent 35%, rgba(210, 173, 46, 0.03) 35%, rgba(210, 173, 46, 0.03) 65%, transparent 65%),
            linear-gradient(-45deg, transparent 35%, rgba(244, 208, 63, 0.04) 35%, rgba(244, 208, 63, 0.04) 65%, transparent 65%),
            repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(210, 173, 46, 0.02) 8px, rgba(210, 173, 46, 0.02) 16px),
            repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(183, 149, 11, 0.015) 12px, rgba(183, 149, 11, 0.015) 24px);
          background-size: 40px 40px, 40px 40px, 40px 40px, 40px 40px, 20px 20px, 20px 20px, 16px 16px, 24px 24px;
          border: 2px solid;
          border-image: linear-gradient(45deg, #D2AD2E, #F4D03F, #D2AD2E, #B7950B) 1;
          border-radius: 0;
          padding: 12px;
          margin: 6px 0 6px 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          position: relative;
          animation: gradientShift 3s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0% { border-image: linear-gradient(45deg, #D2AD2E, #F4D03F, #D2AD2E, #B7950B) 1; }
          25% { border-image: linear-gradient(135deg, #F4D03F, #D2AD2E, #B7950B, #D2AD2E) 1; }
          50% { border-image: linear-gradient(225deg, #D2AD2E, #B7950B, #D2AD2E, #F4D03F) 1; }
          75% { border-image: linear-gradient(315deg, #B7950B, #D2AD2E, #F4D03F, #D2AD2E) 1; }
          100% { border-image: linear-gradient(45deg, #D2AD2E, #F4D03F, #D2AD2E, #B7950B) 1; }
        }
        .karak-content { flex: 1; text-align: left; max-width: 50%; }
        .karak-image { width: 120px; height: 140px; object-fit: cover; border: 1px solid var(--border-color); flex-shrink: 0; align-self: flex-start; }
        .karak-header { display: flex; align-items: baseline; margin-bottom: 12px; gap: 8px; }
        .karak-dot { color: #D2AD2E; font-weight: bold; font-size: 1rem; }
        .karak-name { font-weight: 600; font-size: 1.15rem; color: var(--text-primary); }
        .karak-price { font-weight: 600; font-size: 0.98rem; color: var(--text-primary); }

        .theme-toggle {
          position: fixed;
          top: 16px;
          right: 16px;
          background: var(--text-primary);
          color: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 25px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .theme-toggle:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
        .theme-toggle:active { transform: scale(0.95); }
      `}</style>
    </main>
  )
}
