import Button from '../components/Button';
import FAQ from '../components/FAQ';

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-display font-bold mb-6">Analytics that drive growth</h1>
        <p className="text-h3 text-neutral-600 mb-8">
          Turn raw product usage into actionable insights.
        </p>
        <div className="flex justify-center gap-4">
          <Button href="#lead">Request a demo</Button>
          <Button href="#lead" variant="secondary">Start for free</Button>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4 flex justify-center gap-8 opacity-75">
          <span>Logo1</span>
          <span>Logo2</span>
          <span>Logo3</span>
          <span>Logo4</span>
        </div>
      </section>

      {/* Feature cluster */}
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-h2 font-semibold mb-4">A/B Testing</h2>
          <p className="text-body text-neutral-600 mb-2">Run experiments and ship the best variant.</p>
        </div>
        <div>
          <h2 className="text-h2 font-semibold mb-4">Trend Analysis</h2>
          <p className="text-body text-neutral-600 mb-2">Spot shifts before they impact revenue.</p>
        </div>
        <div>
          <h2 className="text-h2 font-semibold mb-4">User Segmentation</h2>
          <p className="text-body text-neutral-600 mb-2">Understand cohorts with flexible filters.</p>
        </div>
        <div>
          <h2 className="text-h2 font-semibold mb-4">Alerts</h2>
          <p className="text-body text-neutral-600 mb-2">Get notified when metrics move unexpectedly.</p>
        </div>
      </section>

      {/* KPI Story */}
      <section className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-neutral-0 rounded shadow">
            <h3 className="text-h3 font-semibold">Sales</h3>
            <p className="text-body text-neutral-600">$128k</p>
          </div>
          <div className="p-6 bg-neutral-0 rounded shadow">
            <h3 className="text-h3 font-semibold">Visitors</h3>
            <p className="text-body text-neutral-600">32k</p>
          </div>
          <div className="p-6 bg-neutral-0 rounded shadow">
            <h3 className="text-h3 font-semibold">Transactions</h3>
            <p className="text-body text-neutral-600">4k</p>
          </div>
        </div>
      </section>

      {/* Deep Dive */}
      <section className="container mx-auto px-4 py-20 space-y-16">
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:w-1/2">
            <h2 className="text-h2 font-semibold mb-4">All your data in one place</h2>
            <p className="text-body text-neutral-600">Connect warehouses, marketing tools and more.</p>
          </div>
          <div className="md:w-1/2 bg-neutral-100 h-48" aria-hidden="true" />
        </div>
        <div className="md:flex md:items-center md:gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="bg-neutral-100 h-48" aria-hidden="true" />
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <h2 className="text-h2 font-semibold mb-4">Share insights instantly</h2>
            <p className="text-body text-neutral-600">Dashboards update in real time for your team.</p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-h3 font-semibold mb-2">GDPR</h3>
            <p className="text-body text-neutral-600">Compliant data processing.</p>
          </div>
          <div>
            <h3 className="text-h3 font-semibold mb-2">SSO</h3>
            <p className="text-body text-neutral-600">Secure single sign-on.</p>
          </div>
          <div>
            <h3 className="text-h3 font-semibold mb-2">Roles</h3>
            <p className="text-body text-neutral-600">Granular access control.</p>
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-h2 font-semibold mb-6">Ready to get started?</h2>
        <div className="flex justify-center gap-4">
          <Button href="#lead">Request a demo</Button>
          <Button href="#lead" variant="secondary">Start for free</Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-h2 font-semibold mb-8 text-center">FAQ</h2>
        <FAQ />
      </section>

      {/* Lead form */}
      <section id="lead" className="bg-neutral-100 py-20">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-h2 font-semibold mb-6 text-center">Get Access</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="name">Name</label>
              <input id="name" type="text" required className="mt-1 w-full rounded border border-neutral-100 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="email">E-mail</label>
              <input id="email" type="email" required className="mt-1 w-full rounded border border-neutral-100 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="company">Company</label>
              <input id="company" type="text" className="mt-1 w-full rounded border border-neutral-100 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="role">Job Role</label>
              <input id="role" type="text" className="mt-1 w-full rounded border border-neutral-100 p-2" />
            </div>
            <div className="flex items-center">
              <input id="consent" type="checkbox" required className="mr-2" />
              <label htmlFor="consent" className="text-sm text-neutral-600">
                I agree to the processing of my data.
              </label>
            </div>
            <Button href="#" variant="primary">Submit</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-0 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-h3 font-semibold mb-4">Ramos</h3>
            <p className="text-body text-neutral-100">© 2024 Ramos Analytics</p>
          </div>
          <nav className="space-y-2">
            <a className="block" href="#">Features</a>
            <a className="block" href="#">Pricing</a>
            <a className="block" href="#">Contact</a>
          </nav>
          <div className="space-y-2">
            <a className="block" href="#">Legal</a>
            <a className="block" href="#">Privacy</a>
            <a className="block" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
