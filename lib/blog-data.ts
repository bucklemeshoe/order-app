export interface BlogTag {
  name: string
  icon: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  contentHTML: string
  coverImage: string
  date: string
  author: string
  readTime: string
  tags: BlogTag[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ubereats-vs-mrd-vs-oapp',
    title: 'UberEats vs. MrD vs. O.App: The True Cost of Delivery',
    excerpt: 'An honest breakdown of third-party delivery aggregators versus owning your digital storefront, and how to stop bleeding 30% per order.',
    coverImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=2000',
    date: 'March 20, 2026',
    author: 'MakeFriendlyApps Team',
    readTime: '4 min read',
    tags: [
      { name: 'Strategy', icon: '🧠' },
      { name: 'Growth', icon: '📈' },
      { name: 'Profit Margins', icon: '💰' }
    ],
    contentHTML: `
      <h2>The Delivery Dilemma</h2>
      <p>If you run a restaurant in South Africa, you're likely on either UberEats or MrD Food—or both. It's almost unavoidable. The promise is simple: they bring you customers, and you cook the food. But the reality is much more complicated, and increasingly expensive.</p>
      <p>When the pandemic hit, these platforms were a lifeline. Today? They feel more like a permanent tax on your business. Let's break down the reality of relying on third-party aggregators versus taking back control with a first-party platform like <a href="/" class="o-app-link">O.App</a>.</p>
      
      <h2>The Giants: UberEats & MrD Food</h2>
      <p>These platforms are masters of logistics and marketing. They have millions of users and sophisticated apps. But that convenience comes at a steep price.</p>
      
      <h3>The Commission Crush</h3>
      <p>The standard commission rate for both platforms hovers heavily around <strong>30%</strong> per order. If you sell a burger for R100, you're giving away R30 immediately. When your profit margins are traditionally only between 10% and 15%, giving away 30% means you frequently aren't making <em>any</em> money on delivery orders. You're just exchanging cash to stay busy.</p>

      <h3>Pricing Parity and Inflation</h3>
      <p>To survive the 30% cut, most restaurants inflate their delivery prices. A R100 burger becomes R130 on the app. The customer pays R130, plus a delivery fee, plus a service fee. Suddenly, they're paying R160 for a burger, and the restaurant is still barely breaking even. Customers are noticing this "menu inflation," and it's actively driving them away.</p>

      <h3>You Don't Own Your Customers</h3>
      <p>When someone orders your food through MrD or UberEats, they aren't <em>your</em> customer. They are the platform's customer. You don't get their email address, you can't text them a promotional offer on a slow Tuesday, and you have no way to build long-term loyalty. If you leave the platform, you take zero customers with you.</p>

      <h2>The Alternative: First-Party Ordering (O.App)</h2>
      <p>A first-party ordering system is an app or website that belongs entirely to your restaurant. Customers order directly from you, not through an aggregator. This is where <a href="/" class="o-app-link">O.App</a> comes in.</p>

      <h3>Taking Back Your Margin</h3>
      <p>Instead of surrendering 30% on every single order, first-party platforms operate on radically different models—often a flat monthly subscription or a tiny transaction fee (e.g. 2-3% for card processing). Every extra Rand you make goes straight to your bottom line. You can finally make delivery highly profitable again.</p>

      <h3>True Customer Ownership</h3>
      <p>When a customer orders through <a href="/" class="o-app-link">O.App</a>, you get their data. You can build a database, understand their ordering habits, and run targeted marketing campaigns. If someone hasn't ordered in 30 days, you can automatically send them a "We miss you" discount. That's real power.</p>

      <h3>Better Customer Experience</h3>
      <p>By managing your own digital storefront, you control the entire experience. Your brand isn't stuffed into a generic list alongside 50 competitors fighting for attention. It's just you. Plus, because you aren't paying a 30% commission, you can offer slightly lower delivery prices than on UberEats, incentivising customers directly into your native app.</p>

      <h2>The Hybrid Strategy</h2>
      <p>Are we saying you should delete UberEats and MrD tomorrow? Not necessarily.</p>
      <p>For many restaurants, the smartest strategy is a <strong>hybrid approach</strong>:</p>
      <ul>
        <li>Keep the aggregators running, but treat them exclusively as <strong>marketing channels</strong> to acquire new customers.</li>
        <li>Put flyers or stickers in every third-party delivery bag: <em>"Next time, order directly on our native app and get 10% off!"</em></li>
        <li>Aggressively convert those high-cost third-party customers into highly profitable first-party regulars over time.</li>
      </ul>
      <p>By filtering traffic from the big aggregators into your own native <a href="/" class="o-app-link">O.App</a> ecosystem, you get the absolute best of both worlds: discovery from the giant monopolies, and scalable profitability from your own private platform.</p>
    `
  }
]
