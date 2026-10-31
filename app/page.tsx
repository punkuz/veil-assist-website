import { AuthNav } from "./components/AuthNav";

const Arrow = () => <span aria-hidden="true">↗</span>;

const Waveform = () => (
  <div className="waveform" aria-hidden="true">
    {Array.from({ length: 34 }, (_, index) => (
      <i key={index} style={{ "--wave": `${18 + ((index * 23) % 58)}%` } as React.CSSProperties} />
    ))}
  </div>
);

export default function Home() {
  return (
    <main>
      <nav className="nav shell-width" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Veil Assist home">
          <span className="brand-mark" aria-hidden="true" />
          <span>VEIL</span>
        </a>
        <div className="nav-links">
          <a href="#product">Product</a>
          <a href="#pricing">Pricing</a>
          <a href="#privacy">Privacy</a>
          <a href="#how">How it works</a>
        </div>
        <div className="nav-actions"><AuthNav /><a className="nav-cta" href="#download">Get Veil <Arrow /></a></div>
      </nav>

      <section className="hero shell-width" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="eyebrow reveal"><span /> Your invisible desktop assistant</div>
        <h1 className="reveal delay-1">Stay present.<br /><em>Veil keeps up.</em></h1>
        <p className="hero-copy reveal delay-2">
          Real-time, invisible assistance for your calls and presentations.
        </p>
        <div className="hero-actions reveal delay-3">
          <a className="button button-primary" href="#product">See Veil in action <span>↓</span></a>
          <a className="button button-quiet" href="#privacy">Built privacy-first</a>
        </div>

        <div className="hero-stage reveal delay-4" id="product">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="screen-glow" aria-hidden="true" />
          <div className="app-window">
            <div className="app-topbar">
              <div className="app-brand"><span className="mini-mark" /> Veil</div>
              <div className="app-tabs"><b>Session</b><span>Answer</span><span>Screen</span><span>Notes</span></div>
              <div className="app-actions"><span className="protected">◉</span><span>⚙</span><span>—</span></div>
            </div>
            <div className="app-body">
              <div className="meeting-panel">
                <div className="meeting-head">
                  <div><small>LIVE SESSION</small><strong>Product review</strong></div>
                  <span className="recording"><i /> 18:42</span>
                </div>
                <div className="speaker-card">
                  <div className="avatar avatar-a">AM</div>
                  <div><strong>Alex Morgan</strong><small>What are the risks if we move the launch forward?</small></div>
                  <span>Now</span>
                </div>
                <Waveform />
                <div className="transcript-line"><span>18:39</span><p>We can bring the beta forward, but we need a clear rollback path and final security review.</p></div>
                <div className="transcript-line active"><span>18:42</span><p>What are the risks if we move the launch forward?</p></div>
              </div>
              <div className="answer-panel">
                <div className="answer-label"><span>✦</span> SUGGESTED ANSWER <i>Ready</i></div>
                <h3>Three risks to call out.</h3>
                <ol>
                  <li><b>Quality:</b> less time for edge-case testing.</li>
                  <li><b>Support:</b> the team needs an incident plan sooner.</li>
                  <li><b>Trust:</b> communicate the beta scope clearly.</li>
                </ol>
                <div className="context-chip"><span>▣</span> Screen context included</div>
                <div className="answer-footer"><span>Generated from this conversation</span><button aria-label="Copy suggested answer">Copy</button></div>
              </div>
            </div>
            <div className="app-status"><span><i /> Screen protected</span><span>⌘ ⇧ Space to show or hide</span></div>
          </div>
          <div className="floating-chip chip-left"><span>≋</span><div><small>LIVE TRANSCRIPT</small><b>Listening…</b></div></div>
          <div className="floating-chip chip-right"><span>✦</span><div><small>QUESTION DETECTED</small><b>Answer ready</b></div></div>
        </div>
      </section>

      <section className="signal-bar">
        <div className="shell-width signal-inner">
          <span>BUILT FOR THE MOMENT</span>
          <div><i /> Calls</div><div><i /> Presentations</div><div><i /> Focused work</div><div><i /> Private notes</div>
        </div>
      </section>

      <section className="section shell-width" id="how">
        <div className="section-kicker">ONE CALM SURFACE</div>
        <div className="section-heading">
          <h2>Everything you need.<br /><em>Nothing in the way.</em></h2>
          <p>Veil turns the noise of a live conversation into a clear next step without dragging you out of the room.</p>
        </div>

        <div className="bento-grid">
          <article className="bento bento-wide">
            <div className="card-copy"><span className="card-number">01</span><h3>Answers, while it matters</h3><p>Veil notices spoken and on-screen questions, then drafts a useful response using the live conversation and visual context.</p></div>
            <div className="answer-stack">
              <div className="question-pill"><span>Q</span> What should we prioritise this week?</div>
              <div className="stack-card back" />
              <div className="stack-card">
                <small>✦ SUGGESTED ANSWER</small>
                <p>Focus on the onboarding friction first. It is the clearest blocker to activation and the fastest win to validate.</p>
                <div><span>Conversation</span><span>Screen</span><span>Notes</span></div>
              </div>
            </div>
          </article>

          <article className="bento bento-tall">
            <div className="card-copy"><span className="card-number">02</span><h3>Context, not clutter</h3><p>Capture the display you choose. Veil follows slides, chat, and documents only after you start a session.</p></div>
            <div className="scan-visual">
              <div className="scan-grid" />
              <div className="scan-line" />
              <div className="screen-card"><small>SCREEN CONTEXT</small><b>Roadmap review</b><p>“How will we measure a successful beta?”</p><span>Question found</span></div>
            </div>
          </article>

          <article className="bento bento-small">
            <div className="privacy-pulse"><span>✓</span><i /><i /><i /></div>
            <div className="card-copy"><span className="card-number">03</span><h3>Local by default</h3><p>Recordings, transcripts, notes, and answer history stay in your own workspace.</p></div>
          </article>

          <article className="bento bento-small shortcut-card">
            <div className="shortcut-demo">
              <div className="shortcut-line"><span>Show or hide</span><div className="key-row"><kbd>⌘</kbd><kbd>⇧</kbd><kbd className="key-wide">Space</kbd></div></div>
              <div className="shortcut-line"><span>Move Veil</span><div className="key-row"><kbd>⌘</kbd><kbd>⌥</kbd><kbd className="key-arrows">← ↑ ↓ →</kbd></div></div>
            </div>
            <div className="card-copy"><span className="card-number">04</span><h3>There when you need it</h3><p>Summon, hide, or reposition Veil without leaving the keyboard. Always close, never in the way.</p></div>
          </article>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="pricing-glow" aria-hidden="true" />
        <div className="shell-width pricing-wrap">
          <div className="section-kicker">SIMPLE, FLEXIBLE PRICING</div>
          <div className="pricing-heading">
            <h2>Pay for the time<br /><em>you actually use.</em></h2>
            <p>Start free, then top up whenever you need more. No subscription and no recurring bill.</p>
          </div>

          <div className="pricing-grid">
            <article className="price-card">
              <div className="price-card-head"><span>Free Trial</span><small>TRY VEIL</small></div>
              <div className="price"><sup>$</sup><strong>0</strong></div>
              <div className="price-divider" />
              <p><b>3 × 10-minute</b> sessions</p>
              <span className="price-note">One-time trial</span>
              <a href="#download">Start free <Arrow /></a>
            </article>

            <article className="price-card">
              <div className="price-card-head"><span>Starter</span><small>1 CREDIT</small></div>
              <div className="price"><sup>$</sup><strong>5</strong></div>
              <div className="price-divider" />
              <p><b>30 minutes</b> of Veil</p>
              <span className="price-note">Pay as you go</span>
              <a href="#download">Get Starter <Arrow /></a>
            </article>

            <article className="price-card is-featured">
              <div className="popular-label">MOST POPULAR</div>
              <div className="price-card-head"><span>Plus Pack</span><small>3 CREDITS</small></div>
              <div className="price"><sup>$</sup><strong>12</strong></div>
              <div className="price-divider" />
              <p><b>90 minutes</b> of Veil</p>
              <span className="price-note">3 credits · Save 20%</span>
              <a href="#download">Choose Plus <Arrow /></a>
            </article>

            <article className="price-card">
              <div className="price-card-head"><span>Power Pack</span><small>10 CREDITS</small></div>
              <div className="price"><sup>$</sup><strong>35</strong></div>
              <div className="price-divider" />
              <p><b>300 minutes</b> of Veil</p>
              <span className="price-note">10 credits · Save 30%</span>
              <a href="#download">Go Power <Arrow /></a>
            </article>
          </div>

          <div className="pricing-foot"><span><i /> Credits never auto-renew</span><span>1 credit = 30 minutes</span></div>
        </div>
      </section>

      <section className="privacy-section" id="privacy">
        <div className="privacy-aura" aria-hidden="true" />
        <div className="shell-width privacy-grid">
          <div className="privacy-copy">
            <div className="section-kicker">PRIVACY WITH PROOF</div>
            <h2>Your context is<br /><em>yours to control.</em></h2>
            <p>Private, discreet, and under your control.
Veil only captures when you choose, strictly isolates your account data, and stays hidden during screen shares giving you real-time support without breaking your flow.</p>
            <a href="#principles">Read the principles <Arrow /></a>
          </div>
          <div className="privacy-console" id="principles">
            <div className="console-head"><span>PRIVACY STATUS</span><b>All clear</b></div>
            <div className="console-row"><span className="console-icon">◎</span><div><b>Capture is explicit</b><small>Nothing starts before you confirm the session.</small></div><i>ON</i></div>
            <div className="console-row"><span className="console-icon">⌂</span><div><b>Recordings stay local</b><small>Saved to your device, in your account workspace.</small></div><i>LOCAL</i></div>
            <div className="console-row"><span className="console-icon">◇</span><div><b>Your provider, your key</b><small>Connect Gemini, OpenAI, or a compatible endpoint.</small></div><i>YOURS</i></div>
            <div className="console-row"><span className="console-icon">◉</span><div><b>Visibility you control</b><small>Test protection with the exact app and capture mode you use.</small></div><i>READY</i></div>
            <div className="console-foot"><span><i /> Encrypted credentials</span><span>Consent required</span></div>
          </div>
        </div>
      </section>

      <section className="steps section shell-width">
        <div className="section-kicker">FROM QUESTION TO CLARITY</div>
        <div className="section-heading compact"><h2>Three beats.<br /><em>One better answer.</em></h2></div>
        <div className="step-grid">
          <article><span>01</span><div className="step-icon">≋</div><h3>Veil listens</h3><p>Live transcription keeps pace with the conversation you chose to capture.</p></article>
          <article><span>02</span><div className="step-icon">⌁</div><h3>Veil connects</h3><p>Recent speech, screen context, and your question become one coherent picture.</p></article>
          <article><span>03</span><div className="step-icon">✦</div><h3>You respond</h3><p>A concise suggestion appears, ready for you to shape in your own voice.</p></article>
        </div>
      </section>

      <section className="final-cta shell-width" id="download">
        <div className="cta-lines" aria-hidden="true" />
        <span className="cta-orb orb-a" aria-hidden="true" /><span className="cta-orb orb-b" aria-hidden="true" />
        <div className="mini-logo"><span className="brand-mark" /></div>
        <h2>Ready for the room?</h2>
        <p>Bring a calmer, sharper assistant to your next call—now on macOS and Windows.</p>
        <div className="download-actions">
          <a className="button button-primary" href="https://github.com/punkuz/veil-releases/releases/download/v0.6.0-beta.2/Veil.Assist-0.6.0-beta.2-arm64.dmg">Download for macOS <Arrow /></a>
          <a className="button button-secondary" href="https://github.com/punkuz/veil-releases/releases/download/v0.6.0-beta.3/Veil.Assist.Setup.0.6.0-beta.3.exe">Download for Windows <Arrow /></a>
        </div>
        <small>macOS beta 0.6.0-beta.2 · Apple silicon &nbsp;·&nbsp; Windows beta 0.6.0-beta.3</small>
      </section>

      <footer className="footer shell-width">
        <a className="brand" href="#top"><span className="brand-mark" /> <span>VEIL</span></a>
        <p>Private assistance for focused work.</p>
        <div><a href="#privacy">Privacy</a><a href="#product">Product</a><span>© 2026 Veil Assist</span></div>
      </footer>
    </main>
  );
}
