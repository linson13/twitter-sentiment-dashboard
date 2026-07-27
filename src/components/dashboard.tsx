import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Github,
  Database,
  Sparkles,
  Brain,
  Terminal,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import data from '@/data/dashboard_data.json';
import ConfusionMatrixHeatmap from '@/components/confusion-matrix-heatmap';

const CLASS_COLOR: Record<string, string> = {
  positive: '#0f9d78',
  negative: '#d6455a',
  neutral: '#7d8ba1',
};

const SOURCE_LABEL: Record<string, string> = {
  nltk_twitter_samples: 'NLTK twitter_samples',
  tweet_sentiment_extraction: 'Tweet Sentiment Extraction (Kaggle)',
  laxmimerit_twitter30k: 'laxmimerit/twitter-data',
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className="py-16 sm:py-20 border-t border-border"
    >
      <div className="max-w-5xl mx-auto px-6">
        <p className="font-data text-xs tracking-widest uppercase text-cobalt mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-8">
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}

export default function Dashboard() {
  const { dataset, metrics, confusion_matrix, top_words, sample_predictions } = data;

  const labelPieData = useMemo(
    () =>
      Object.entries(dataset.by_label).map(([name, value]) => ({
        name,
        value,
      })),
    [dataset.by_label],
  );

  const sourceBarData = useMemo(
    () =>
      Object.entries(dataset.by_source)
        .map(([name, value]) => ({ name: SOURCE_LABEL[name] ?? name, value }))
        .sort((a, b) => b.value - a.value),
    [dataset.by_source],
  );

  const metricsBarData = useMemo(
    () =>
      metrics.classes.map((cls) => ({
        name: cls,
        precision: metrics.per_class[cls as keyof typeof metrics.per_class].precision,
        recall: metrics.per_class[cls as keyof typeof metrics.per_class].recall,
        f1: metrics.per_class[cls as keyof typeof metrics.per_class].f1,
      })),
    [metrics],
  );

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-semibold text-ink">
            Sentiment<span className="text-cobalt">.Analysis</span>
          </span>
          <a
            href="https://github.com/linson13/twitter-sentiment-dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-cobalt transition-colors"
          >
            <Github className="w-4 h-4" />
            View source
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-12">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <p className="font-data text-xs tracking-widest uppercase text-cobalt mb-4">
            NLP · Text Analytics Project
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight max-w-3xl">
            Twitter Sentiment Analysis
          </h1>
          <p className="mt-5 text-lg text-ink-soft max-w-2xl leading-relaxed">
            A TF-IDF + Logistic Regression classifier trained on{' '}
            <strong className="text-ink font-semibold">
              {dataset.total.toLocaleString()} real, human-labeled tweets
            </strong>{' '}
            combined from three independent public datasets — evaluated
            honestly, including where it struggles.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Tweets analyzed', value: dataset.total.toLocaleString() },
            { label: 'Test accuracy', value: `${(metrics.accuracy * 100).toFixed(1)}%` },
            { label: 'Public data sources', value: '3' },
            { label: 'TF-IDF features', value: '20,000' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-paper-raised border border-border rounded-xl px-4 py-5"
            >
              <div className="font-data text-2xl sm:text-3xl font-semibold text-ink">
                {stat.value}
              </div>
              <div className="text-xs text-ink-soft mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </header>

      {/* Dataset composition */}
      <Section id="dataset" eyebrow="01 — Data" title="Dataset composition">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-display text-sm font-semibold text-ink-soft mb-4">
              By sentiment label
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={labelPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                    stroke="none"
                  >
                    {labelPieData.map((entry) => (
                      <Cell key={entry.name} fill={CLASS_COLOR[entry.name] ?? '#999'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-2">
                {labelPieData.map((entry) => (
                  <li key={entry.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: CLASS_COLOR[entry.name] ?? '#999' }}
                    />
                    <span className="capitalize text-ink">{entry.name}</span>
                    <span className="font-data text-ink-soft">
                      {entry.value.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-ink-soft mb-4">
              By source dataset
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sourceBarData} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 11, fill: '#475467' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => v.toLocaleString()}
                  contentStyle={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e4e7ec',
                  }}
                />
                <Bar dataKey="value" fill="#2647d6" radius={[0, 4, 4, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Pipeline */}
      <Section id="pipeline" eyebrow="02 — Method" title="Processing pipeline">
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            {
              icon: Database,
              title: 'Build',
              desc: 'Download and merge all 3 public datasets into one labeled set.',
            },
            {
              icon: Sparkles,
              title: 'Preprocess',
              desc: 'spaCy strips URLs/mentions, tokenizes, lemmatizes, removes stopwords.',
            },
            {
              icon: Brain,
              title: 'Train',
              desc: 'TF-IDF (20k features, unigrams+bigrams) + Logistic Regression.',
            },
            {
              icon: Terminal,
              title: 'Predict',
              desc: 'CLI scores new text using the trained model.',
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="bg-paper-raised border border-border rounded-xl p-5 relative"
            >
              <span className="font-data text-xs text-ink-faint">0{i + 1}</span>
              <step.icon className="w-5 h-5 text-cobalt my-3" />
              <h3 className="font-display font-semibold text-ink mb-1">{step.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Model performance */}
      <Section id="performance" eyebrow="03 — Results" title="Model performance">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="font-display text-sm font-semibold text-ink-soft mb-4">
              Confusion matrix{' '}
              <span className="text-ink-faint font-normal">
                ({metrics.test_size.toLocaleString()} held-out tweets)
              </span>
            </h3>
            <ConfusionMatrixHeatmap
              labels={confusion_matrix.labels}
              matrix={confusion_matrix.matrix}
            />
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-ink-soft mb-4">
              Precision / recall / F1 by class
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metricsBarData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#475467' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: '#475467' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid #e4e7ec',
                  }}
                />
                <Bar dataKey="precision" fill="#2647d6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="recall" fill="#8ea2f2" radius={[3, 3, 0, 0]} />
                <Bar dataKey="f1" fill="#101828" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 justify-center text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cobalt" /> Precision
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: '#8ea2f2' }}
                />{' '}
                Recall
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink" /> F1
              </span>
            </div>
          </div>
        </div>

        {/* Honest limitation callout */}
        <div className="mt-10 bg-negative-soft border border-negative/20 rounded-xl p-5 flex gap-4">
          <XCircle className="w-5 h-5 text-negative shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-semibold text-ink mb-1">
              Neutral is the hard class — and here's why
            </h4>
            <p className="text-sm text-ink-soft leading-relaxed">
              Neutral tweets are only labeled in one of the three source
              datasets, so the model sees proportionally far fewer neutral
              examples than positive or negative ones. Recall on neutral is
              just {(metrics.per_class.neutral.recall * 100).toFixed(0)}%.
              This is a known tradeoff of combining independently-labeled
              corpora for scale, not a hidden flaw — see the sample
              predictions below for real examples of where it breaks down.
            </p>
          </div>
        </div>
      </Section>

      {/* Top words */}
      <Section id="words" eyebrow="04 — Interpretability" title="Most predictive words per class">
        <div className="grid sm:grid-cols-3 gap-6">
          {metrics.classes.map((cls) => (
            <div key={cls}>
              <h3
                className="font-display text-sm font-semibold mb-3 capitalize"
                style={{ color: CLASS_COLOR[cls] }}
              >
                {cls}
              </h3>
              <ul className="space-y-1.5">
                {(top_words[cls as keyof typeof top_words] as { word: string; score: number }[])
                  .slice(0, 8)
                  .map((w) => (
                    <li
                      key={w.word}
                      className="flex items-center justify-between text-sm border-b border-border/60 pb-1.5"
                    >
                      <span className="font-data text-ink">{w.word}</span>
                      <span className="font-data text-xs text-ink-faint">
                        {w.score.toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Sample predictions */}
      <Section
        id="samples"
        eyebrow="05 — Evidence"
        title="Real predictions from the held-out test set"
      >
        <div className="space-y-3">
          {sample_predictions.map((s, i) => (
            <div
              key={i}
              className="bg-paper-raised border border-border rounded-xl p-4 flex items-start gap-4"
            >
              {s.correct ? (
                <CheckCircle2 className="w-5 h-5 text-positive shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-negative shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink leading-relaxed">"{s.text.trim()}"</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 font-data text-xs text-ink-soft">
                  <span>
                    true: <span className="capitalize text-ink">{s.true_label}</span>
                  </span>
                  <span>
                    predicted:{' '}
                    <span className="capitalize" style={{ color: CLASS_COLOR[s.predicted_label] }}>
                      {s.predicted_label}
                    </span>
                  </span>
                  <span>confidence: {(s.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-soft">
            Built by Linson Thomas Verghese — full source and reproduction
            steps in the repo.
          </p>
          <a
            href="https://github.com/linson13/twitter-sentiment-dashboard"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cobalt hover:text-cobalt-dark transition-colors"
          >
            View on GitHub
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
