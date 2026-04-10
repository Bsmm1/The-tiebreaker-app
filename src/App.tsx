import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  LayoutGrid, 
  ListChecks, 
  Table as TableIcon, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert,
  Loader2,
  Sparkles,
  Github,
  ExternalLink,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { analyzeDecision, DecisionAnalysis } from "./services/geminiService";
import { ThemeToggle } from "./components/theme-toggle";

export default function App() {
  const [decision, setDecision] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeDecision(decision);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "low": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Header */}
      <header className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Scale size={20} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">B Tiebreaker</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground mr-4">
              <span>Pros & Cons</span>
              <span>SWOT</span>
              <span>Comparison</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
              AI-Powered Decision Assistant
            </Badge>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Stop overthinking. <br />
              <span className="text-indigo-600 dark:text-indigo-400">Start deciding.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Enter the decision you're struggling with, and let our AI analyze the pros, cons, and strategic implications to help you break the tie.
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.form 
            onSubmit={handleAnalyze}
            className="max-w-2xl mx-auto relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex items-center">
              <Input
                placeholder="Should I move to a new city for a job?"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="h-16 pl-6 pr-32 text-lg rounded-2xl border-2 border-input focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-card shadow-xl shadow-indigo-500/5"
                disabled={loading}
              />
              <Button 
                type="submit" 
                className="absolute right-2 h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
                disabled={loading || !decision.trim()}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Analyze <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64 rounded-3xl" />
                <Skeleton className="h-64 rounded-3xl" />
              </div>
              <Skeleton className="h-96 rounded-3xl" />
            </motion.div>
          )}

          {analysis && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-10"
            >
              {/* Summary Card */}
              <Card className="border shadow-2xl shadow-indigo-500/10 overflow-hidden rounded-3xl bg-card">
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                  <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12" />
                  <div className="relative z-10">
                    <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">The Analysis</h2>
                    <p className="text-2xl font-display font-semibold leading-tight">{analysis.decision}</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg leading-relaxed italic">
                    "{analysis.summary}"
                  </p>
                </CardContent>
              </Card>

              {/* Main Analysis Tabs */}
              <Tabs defaultValue="pros-cons" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted rounded-2xl mb-8">
                  <TabsTrigger value="pros-cons" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold">
                    <ListChecks className="mr-2" size={18} /> Pros & Cons
                  </TabsTrigger>
                  <TabsTrigger value="swot" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold">
                    <LayoutGrid className="mr-2" size={18} /> SWOT Analysis
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm font-semibold">
                    <TableIcon className="mr-2" size={18} /> Comparison
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pros-cons" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={24} />
                          <CardTitle className="font-display">Pros</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {analysis.pros.map((pro, i) => (
                          <div key={i} className="flex items-start gap-3 group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground leading-snug">{pro.point}</p>
                              <Badge variant="outline" className={`mt-2 text-[10px] uppercase font-bold px-2 py-0 ${getWeightColor(pro.weight)}`}>
                                {pro.weight} Impact
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Cons */}
                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-rose-500/5 border-b border-rose-500/10">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <XCircle size={24} />
                          <CardTitle className="font-display">Cons</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        {analysis.cons.map((con, i) => (
                          <div key={i} className="flex items-start gap-3 group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground leading-snug">{con.point}</p>
                              <Badge variant="outline" className={`mt-2 text-[10px] uppercase font-bold px-2 py-0 ${getWeightColor(con.weight)}`}>
                                {con.weight} Impact
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="swot" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Zap size={24} />
                          <CardTitle className="font-display">Strengths</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {analysis.swot.strengths.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-foreground">
                              <div className="mt-2 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <AlertTriangle size={24} />
                          <CardTitle className="font-display">Weaknesses</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {analysis.swot.weaknesses.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-foreground">
                              <div className="mt-2 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <TrendingUp size={24} />
                          <CardTitle className="font-display">Opportunities</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {analysis.swot.opportunities.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-foreground">
                              <div className="mt-2 w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <CardHeader className="bg-slate-500/5 border-b border-slate-500/10">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <ShieldAlert size={24} />
                          <CardTitle className="font-display">Threats</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3">
                          {analysis.swot.threats.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-foreground">
                              <div className="mt-2 w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="mt-0">
                  {analysis.comparison ? (
                    <Card className="border shadow-lg rounded-3xl bg-card overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead className="w-[200px] font-bold text-foreground">Factor</TableHead>
                              {analysis.comparison.headers.map((header, i) => (
                                <TableHead key={i} className="font-bold text-foreground">{header}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analysis.comparison.rows.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                                {row.values.map((val, j) => (
                                  <TableCell key={j} className="text-muted-foreground">{val}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                      <p className="text-muted-foreground">No specific comparison data available for this decision.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Recommendation Section */}
              <div className="pt-10">
                <Separator className="mb-10" />
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h3 className="text-3xl font-display font-bold mb-4">The Tiebreaker Verdict</h3>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {analysis.recommendation}
                    </p>
                  </div>
                  <div className="w-full md:w-auto">
                    <Button 
                      onClick={() => {
                        setAnalysis(null);
                        setDecision("");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant="outline" 
                      className="h-14 px-8 rounded-2xl border-2 border-border hover:bg-accent font-bold"
                    >
                      Analyze Another Decision
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t py-16 mt-20 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="text-indigo-600" size={24} />
                <span className="font-display font-bold text-lg">B Tiebreaker</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A professional-grade decision assistant powered by advanced AI. Designed to provide clarity and strategic insight for complex choices.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-display font-bold">Project Info</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-500" />
                  Decision Intelligence
                </li>
                <li className="flex items-center gap-2">
                  <Zap size={14} className="text-indigo-500" />
                  Gemini 3 Flash API
                </li>
                <li className="flex items-center gap-2">
                  <LayoutGrid size={14} className="text-indigo-500" />
                  React & Tailwind CSS
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-display font-bold">Developer</h4>
              <p className="text-sm text-muted-foreground">
                Developed by <strong>Bassam Almaydhan</strong>. <br />
                Exploring the intersection of AI and User Experience.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github size={18} />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={18} />
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              &copy; 2026 B Tiebreaker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
