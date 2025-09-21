import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  TrendingUp,
  Settings
} from 'lucide-react';
import { browserScanAPI, BrowserScanResult } from '@/services/browserScanAPI';
import { backendAPI } from '@/services/backendAPI';
import { patternAnalysisAPI, URLAnalysisResult } from '@/services/patternAnalysisAPI';
import { useRealtimeAlerts } from '@/hooks/useRealtime';

const Protection = () => {
  const [scanResult, setScanResult] = useState<BrowserScanResult | null>(null);
  const [urlScanResult, setUrlScanResult] = useState<URLAnalysisResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [urlScanning, setUrlScanning] = useState(false);
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const { toast } = useToast();
  const { events } = useRealtimeAlerts();

  // Handle real-time scan alerts
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      if (latestEvent.type === 'scan_completed') {
        toast({
          title: "Background Scan Complete",
          description: `Risk score: ${latestEvent.data.riskScore}/10, Patterns: ${latestEvent.data.patternsFound}`
        });
      }
    }
  }, [events]);

  useEffect(() => {
    // Auto-scan on page load if enabled
    if (autoScanEnabled) {
      performScan();
    }
  }, [autoScanEnabled]);

  const performScan = async () => {
    setScanning(true);
    try {
      const result = await browserScanAPI.scanCurrentTab();
      setScanResult(result);
      
      // Store scan result in backend
      try {
        await backendAPI.submitPattern({
          title: `Scan Result: ${result.domain}`,
          description: `Automated scan detected ${result.detectedPatterns.length} patterns`,
          website_url: result.url,
          pattern_type: result.detectedPatterns.length > 0 ? 'dark_pattern' : 'ethical_alternative',
          category: 'other',
          screenshot_url: '',
          impact_score: Math.min(result.riskScore, 5),
          scan_result: true
        });
      } catch (backendError) {
        // Silently handle backend storage error
      }
      
      if (result.detectedPatterns.length > 0) {
        toast({
          title: "Dark Patterns Detected!",
          description: `Found ${result.detectedPatterns.length} potential issues. Risk score: ${result.riskScore}/10`,
          variant: result.riskScore > 6 ? "destructive" : "default"
        });
      } else {
        toast({
          title: "Scan Complete",
          description: "No dark patterns detected on this page."
        });
      }
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan the current page. Please try again.",
        variant: "destructive"
      });
    }
    setScanning(false);
  };

  const performUrlScan = async () => {
    if (!scanUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    setUrlScanning(true);
    try {
      const result = await patternAnalysisAPI.analyzeURL(scanUrl);
      setUrlScanResult(result);
      
      // Store URL scan result in backend
      try {
        await backendAPI.submitPattern({
          title: `URL Scan: ${result.domain}`,
          description: `URL analysis detected ${result.detectedPatterns.length} patterns. ${result.description || ''}`,
          website_url: scanUrl,
          pattern_type: result.detectedPatterns.length > 0 ? 'dark_pattern' : 'ethical_alternative',
          category: 'other',
          screenshot_url: result.screenshot || '',
          impact_score: Math.min(result.riskScore, 5),
          url_scan: true
        });
      } catch (backendError) {
        // Silently handle backend storage error
      }
      
      if (result.detectedPatterns.length > 0) {
        toast({
          title: "Dark Patterns Found!",
          description: `Found ${result.detectedPatterns.length} potential issues. Risk score: ${result.riskScore}/10`,
          variant: result.riskScore > 6 ? "destructive" : "default"
        });
      } else {
        toast({
          title: "URL Scan Complete",
          description: "No obvious dark patterns detected on this website."
        });
      }
    } catch (error) {
      toast({
        title: "URL Scan Failed",
        description: "Could not analyze the URL. Please check the URL and try again.",
        variant: "destructive"
      });
    }
    setUrlScanning(false);
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'destructive';
    if (severity >= 3) return 'default';
    return 'secondary';
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="w-10 h-10 text-green-600" />
            Protection Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time protection against dark patterns and deceptive practices
          </p>
        </div>

        {/* Protection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Protection Status</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {protectionEnabled ? (
                      <>
                        <Shield className="w-6 h-6 text-green-600" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-600" />
                        Disabled
                      </>
                    )}
                  </p>
                </div>
                <Button
                  variant={protectionEnabled ? "destructive" : "default"}
                  onClick={() => setProtectionEnabled(!protectionEnabled)}
                >
                  {protectionEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Page</p>
                  <p className="text-lg font-bold flex items-center gap-2">
                    {scanResult?.isSecure ? (
                      <Lock className="w-5 h-5 text-green-600" />
                    ) : (
                      <Unlock className="w-5 h-5 text-red-600" />
                    )}
                    {scanResult?.domain || window.location.hostname}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <p className={`text-2xl font-bold ${getRiskColor(scanResult?.riskScore || 0)}`}>
                    {scanResult?.riskScore || 0}/10
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Page Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Current Page Scanner
              </CardTitle>
              <CardDescription>
                Scan the current page for dark patterns and deceptive practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={performScan} 
                    disabled={scanning || !protectionEnabled}
                    className="flex items-center gap-2"
                  >
                    {scanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scan className="w-4 h-4" />
                    )}
                    {scanning ? 'Scanning...' : 'Scan Current Page'}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto-scan"
                      checked={autoScanEnabled}
                      onChange={(e) => setAutoScanEnabled(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="auto-scan" className="text-sm">
                      Auto-scan
                    </label>
                  </div>
                </div>

                {scanResult && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(scanResult.scanTimestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{scanResult.title}</p>
                    <p className="text-xs text-muted-foreground">{scanResult.url}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* URL Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                URL Scanner
              </CardTitle>
              <CardDescription>
                Analyze any website URL for dark patterns and security risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={performUrlScan} 
                    disabled={urlScanning || !protectionEnabled}
                    className="flex items-center gap-2"
                  >
                    {urlScanning ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scan className="w-4 h-4" />
                    )}
                    {urlScanning ? 'Analyzing...' : 'Scan URL'}
                  </Button>
                </div>

                {urlScanResult && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{urlScanResult.domain}</span>
                      <Badge variant={urlScanResult.riskScore > 6 ? 'destructive' : 'secondary'}>
                        Risk: {urlScanResult.riskScore}/10
                      </Badge>
                    </div>
                    <p className="text-sm">{urlScanResult.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {urlScanResult.detectedPatterns.length} patterns detected
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scan Results */}
        {(scanResult || urlScanResult) && (
          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patterns">
                Current Page ({scanResult?.detectedPatterns.length || 0})
              </TabsTrigger>
              <TabsTrigger value="url-analysis">
                URL Analysis ({urlScanResult?.detectedPatterns.length || 0})
              </TabsTrigger>
              <TabsTrigger value="elements">
                Page Elements ({scanResult?.pageElements.length || 0})
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="mt-6">
              {scanResult && scanResult.detectedPatterns.length > 0 ? (
                <div className="space-y-4">
                  {scanResult.detectedPatterns.map((pattern, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg capitalize flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              {pattern.type.replace('_', ' ')}
                            </CardTitle>
                            <CardDescription>{pattern.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={getSeverityColor(pattern.severity)}>
                              Severity: {pattern.severity}/5
                            </Badge>
                            <Badge variant="outline">
                              {Math.round(pattern.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Element:</strong> {pattern.element}
                          </p>
                          <p className="text-sm">
                            <strong>Location:</strong> {pattern.location}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Dark Patterns Detected</h3>
                    <p className="text-muted-foreground">
                      This page appears to be free of common dark patterns.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="elements" className="mt-6">
              {scanResult && scanResult.pageElements ? (
                <div className="space-y-4">
                  {scanResult.pageElements.map((element, index) => (
                  <Card key={index} className={element.isSuspicious ? 'border-l-4 border-l-orange-500' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {element.type}
                            </Badge>
                            {element.isSuspicious && (
                              <Badge variant="destructive">Suspicious</Badge>
                            )}
                          </div>
                          <p className="text-sm mb-1">
                            <strong>Content:</strong> {element.content}
                          </p>
                          {element.reason && (
                            <p className="text-sm text-orange-600">
                              <strong>Reason:</strong> {element.reason}
                            </p>
                          )}
                        </div>
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Scan className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Page Scanned</h3>
                    <p className="text-muted-foreground">
                      Scan the current page to see detailed element analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="url-analysis" className="mt-6">
              {urlScanResult ? (
                <div className="space-y-6">
                  {/* URL Analysis Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>URL Analysis Results</span>
                        <div className="flex gap-2">
                          <Badge variant={urlScanResult.isValid ? 'default' : 'destructive'}>
                            {urlScanResult.isValid ? 'Valid' : 'Invalid'}
                          </Badge>
                          <Badge variant={urlScanResult.riskScore > 6 ? 'destructive' : 'secondary'}>
                            Risk: {urlScanResult.riskScore}/10
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Domain</p>
                          <p className="text-sm text-muted-foreground">{urlScanResult.domain}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Title</p>
                          <p className="text-sm text-muted-foreground">{urlScanResult.title || 'Not available'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium mb-1">Description</p>
                          <p className="text-sm text-muted-foreground">{urlScanResult.description || 'Not available'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Screenshot */}
                  {urlScanResult.screenshot && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Website Screenshot</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={urlScanResult.screenshot} 
                          alt="Website screenshot" 
                          className="w-full h-64 object-cover rounded border"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Detected Patterns */}
                  {urlScanResult.detectedPatterns.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Detected Dark Patterns</h3>
                      {urlScanResult.detectedPatterns.map((pattern, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-red-600">{pattern}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Detected through URL and content analysis
                                </p>
                              </div>
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Dark Patterns Detected</h3>
                        <p className="text-muted-foreground">
                          This website appears to be free of common dark patterns.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Image Analysis Results */}
                  {urlScanResult.imageAnalysis && urlScanResult.imageAnalysis.detectedPatterns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          AI Image Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {urlScanResult.imageAnalysis.detectedPatterns.map((pattern, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium capitalize">
                                  {pattern.type.replace('_', ' ')}
                                </span>
                                <div className="flex gap-2">
                                  <Badge variant={pattern.severity > 3 ? 'destructive' : 'secondary'}>
                                    {pattern.severity}/5
                                  </Badge>
                                  <Badge variant="outline">
                                    {Math.round(pattern.confidence * 100)}%
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{pattern.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No URL Scanned</h3>
                    <p className="text-muted-foreground">
                      Enter a URL in the scanner above to analyze it for dark patterns.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <div className="space-y-4">
                {scanResult?.recommendations.map((recommendation, index) => (
                  <Alert key={index}>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
                {urlScanResult && urlScanResult.detectedPatterns.length > 0 && (
                  <>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        URL analysis detected {urlScanResult.detectedPatterns.length} potential dark patterns. 
                        Exercise caution when using this website.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Consider using browser extensions or ad blockers for additional protection.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Protection Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Protection Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Real-time Protection</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan pages as you browse
                  </p>
                </div>
                <Button
                  variant={protectionEnabled ? "default" : "outline"}
                  onClick={() => setProtectionEnabled(!protectionEnabled)}
                >
                  {protectionEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-scan New Pages</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan when navigating to new pages
                  </p>
                </div>
                <Button
                  variant={autoScanEnabled ? "default" : "outline"}
                  onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                  disabled={!protectionEnabled}
                >
                  {autoScanEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Protection;