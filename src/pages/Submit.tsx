import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertTriangle, Heart, Search, CheckCircle, XCircle, TrendingUp, Camera, Eye, Brain } from 'lucide-react';
import { patternAnalysisAPI, URLAnalysisResult, PatternValidationResult } from '@/services/patternAnalysisAPI';
import { ImageAnalysisResult } from '@/services/imageAnalysisAPI';
import { imageUploadAPI } from '@/services/imageUploadAPI';
import { backendAPI } from '@/services/backendAPI';

const Submit = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company_name: '',
    website_url: '',
    pattern_type: '' as 'dark_pattern' | 'ethical_alternative' | '',
    category: '' as string,
    impact_score: 3,
    screenshot_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlAnalysis, setUrlAnalysis] = useState<URLAnalysisResult | null>(null);
  const [patternValidation, setPatternValidation] = useState<PatternValidationResult | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [analyzingUrl, setAnalyzingUrl] = useState(false);
  const [validatingPattern, setValidatingPattern] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to submit patterns to our database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.pattern_type || !formData.category) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Try backend API first
      const response = await backendAPI.submitPattern({
        ...formData,
        user_id: user.id,
        pattern_type: formData.pattern_type,
        category: formData.category
      });

      if (response.success) {
        toast({ 
          title: "Success!", 
          description: "Your pattern has been submitted and is pending review." 
        });
        navigate('/patterns');
        return;
      }
    } catch (error) {
      // Fallback to Supabase
      const { error: supabaseError } = await supabase
        .from('patterns')
        .insert([{
          ...formData,
          user_id: user.id,
          pattern_type: formData.pattern_type as any,
          category: formData.category as any
        }]);

      if (supabaseError) {
        setError(supabaseError.message);
        toast({ 
          title: "Error", 
          description: "Failed to submit pattern", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Success!", 
          description: "Your pattern has been submitted and is pending review." 
        });
        navigate('/patterns');
      }
    }

    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const analyzeURL = async () => {
    if (!formData.website_url) return;
    
    setAnalyzingUrl(true);
    try {
      const analysis = await patternAnalysisAPI.analyzeURL(formData.website_url);
      setUrlAnalysis(analysis);
      
      if (analysis.isValid) {
        // Auto-fill form data based on analysis
        if (analysis.title && !formData.title) {
          handleInputChange('title', analysis.title);
        }
        if (analysis.screenshot) {
          handleInputChange('screenshot_url', analysis.screenshot);
        }
        
        // Get company info
        const companyInfo = await patternAnalysisAPI.getCompanyInfo(analysis.domain);
        if (companyInfo && !formData.company_name) {
          handleInputChange('company_name', companyInfo.name);
        }
        
        toast({
          title: "URL Analyzed",
          description: `Found ${analysis.detectedPatterns.length} potential issues. Risk score: ${analysis.riskScore}/10`
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the URL. Please continue manually.",
        variant: "destructive"
      });
    }
    setAnalyzingUrl(false);
  };

  const validatePattern = async () => {
    if (!formData.description || !formData.pattern_type) return;
    
    setValidatingPattern(true);
    try {
      const validation = await patternAnalysisAPI.validatePattern(formData);
      setPatternValidation(validation);
      
      if (validation.isValid) {
        // Auto-suggest category if not set
        if (!formData.category && validation.suggestedCategory !== 'other') {
          handleInputChange('category', validation.suggestedCategory);
        }
        
        toast({
          title: "Pattern Validated",
          description: `Confidence: ${Math.round(validation.confidence * 100)}%. Suggested category: ${validation.suggestedCategory}`
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Could not validate the pattern. Please continue manually.",
        variant: "destructive"
      });
    }
    setValidatingPattern(false);
  };

  // Auto-validate when description changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.description.length > 50 && formData.pattern_type) {
        validatePattern();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [formData.description, formData.pattern_type]);

  const analyzeImageUpload = async () => {
    if (!formData.screenshot_url) return;
    
    setAnalyzingImage(true);
    try {
      const analysis = await patternAnalysisAPI.analyzeImageUpload(formData.screenshot_url);
      setImageAnalysis(analysis);
      
      if (analysis.isValid && analysis.detectedPatterns.length > 0) {
        toast({
          title: "AI Analysis Complete",
          description: `Found ${analysis.detectedPatterns.length} dark patterns. Risk score: ${analysis.overallRiskScore}/10`
        });
        
        // Auto-enhance description with findings if empty or short
        if (!formData.description || formData.description.length < 20) {
          const patternDescriptions = analysis.detectedPatterns.map(p => p.description);
          const enhancedDescription = `AI detected: ${patternDescriptions.join('. ')}. ${formData.description || ''}`;
          handleInputChange('description', enhancedDescription.trim());
        }
        
        // Auto-suggest category based on detected patterns
        if (!formData.category) {
          const patternTypes = analysis.detectedPatterns.map(p => p.type);
          if (patternTypes.includes('forced_renewal')) {
            handleInputChange('category', 'streaming');
          } else if (patternTypes.includes('cancellation_trap')) {
            handleInputChange('category', 'fitness');
          } else if (patternTypes.includes('pre_checked')) {
            handleInputChange('category', 'saas');
          }
        }
        
        // Set impact score based on highest severity
        if (formData.impact_score === 3) {
          const maxSeverity = Math.max(...analysis.detectedPatterns.map(p => p.severity));
          handleInputChange('impact_score', maxSeverity);
        }
      } else {
        toast({
          title: "Image Analyzed",
          description: "No obvious dark patterns detected in the image."
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive"
      });
    }
    setAnalyzingImage(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate image
    const validation = imageUploadAPI.validateImage(file);
    if (!validation.valid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }
    
    setUploadingImage(true);
    try {
      // For demo purposes, create a sample URL based on filename
      const fileName = file.name.toLowerCase();
      let demoUrl = 'https://via.placeholder.com/800x600/f3f4f6/6b7280?text=';
      
      if (fileName.includes('auto') || fileName.includes('renewal')) {
        demoUrl = 'https://via.placeholder.com/800x600/fee2e2/dc2626?text=Auto-Renewal+Detected';
      } else if (fileName.includes('cancel') || fileName.includes('call')) {
        demoUrl = 'https://via.placeholder.com/800x600/fef3c7/f59e0b?text=Call+to+Cancel';
      } else if (fileName.includes('addon') || fileName.includes('premium')) {
        demoUrl = 'https://via.placeholder.com/800x600/ddd6fe/8b5cf6?text=Pre-checked+Addons';
      } else {
        demoUrl += encodeURIComponent(file.name);
      }
      
      handleInputChange('screenshot_url', demoUrl);
      
      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully. Analyzing for dark patterns..."
      });
      
      // Auto-analyze the uploaded image
      setTimeout(() => {
        analyzeImageUpload();
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive"
      });
    }
    setUploadingImage(false);
    
    // Clear the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Submit a Pattern</h1>
            <p className="text-xl text-muted-foreground">
              Help build our database of dark patterns and ethical alternatives
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pattern Details</CardTitle>
              <CardDescription>
                Provide detailed information about the pattern you've encountered
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pattern Type */}
                <div className="space-y-3">
                  <Label>Pattern Type *</Label>
                  <RadioGroup 
                    value={formData.pattern_type} 
                    onValueChange={(value) => handleInputChange('pattern_type', value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="dark_pattern" id="dark_pattern" />
                      <Label htmlFor="dark_pattern" className="flex items-center gap-2 cursor-pointer">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        Dark Pattern - Deceptive design that tricks users
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="ethical_alternative" id="ethical_alternative" />
                      <Label htmlFor="ethical_alternative" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="w-4 h-4 text-accent" />
                        Ethical Alternative - User-friendly design solution
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief, descriptive title of the pattern"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of how this pattern works and its impact on users"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Company and Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      placeholder="Company that uses this pattern"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="website_url"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website_url}
                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={analyzeURL}
                        disabled={!formData.website_url || analyzingUrl}
                      >
                        {analyzingUrl ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {urlAnalysis && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {urlAnalysis.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">
                            {urlAnalysis.isValid ? 'URL Analyzed' : 'Analysis Failed'}
                          </span>
                          <Badge variant={urlAnalysis.riskScore > 5 ? 'destructive' : 'secondary'}>
                            Risk: {urlAnalysis.riskScore}/10
                          </Badge>
                        </div>
                        {urlAnalysis.detectedPatterns.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Detected: {urlAnalysis.detectedPatterns.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Category *</Label>
                    {patternValidation?.suggestedCategory && patternValidation.suggestedCategory !== 'other' && (
                      <Badge variant="outline" className="text-xs">
                        Suggested: {patternValidation.suggestedCategory}
                      </Badge>
                    )}
                  </div>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="streaming">Streaming</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Impact Score */}
                {formData.pattern_type === 'dark_pattern' && (
                  <div className="space-y-3">
                    <Label>Impact Score: {formData.impact_score}/5</Label>
                    <div className="px-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.impact_score}
                        onChange={(e) => handleInputChange('impact_score', parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Minor</span>
                        <span>Moderate</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Screenshot Upload */}
                <div className="space-y-2">
                  <Label htmlFor="screenshot_url">Screenshot Evidence</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* URL Input */}
                    <div className="space-y-2">
                      <Label className="text-sm">From URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="screenshot_url"
                          type="url"
                          placeholder="https://example.com/screenshot.jpg"
                          value={formData.screenshot_url}
                          onChange={(e) => handleInputChange('screenshot_url', e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={analyzeImageUpload}
                          disabled={!formData.screenshot_url || analyzingImage}
                        >
                          {analyzingImage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm">Upload Image</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                          onChange={handleImageUpload}
                          className="flex-1"
                          disabled={uploadingImage}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          disabled={uploadingImage}
                          title="Upload and analyze image"
                        >
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG, GIF, WebP (max 10MB)
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Upload a screenshot or provide a URL to demonstrate the dark pattern
                  </p>
                  
                  {/* Image Preview */}
                  {formData.screenshot_url && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Screenshot Preview</span>
                        {imageAnalysis && (
                          <Badge variant={imageAnalysis.overallRiskScore > 5 ? 'destructive' : 'secondary'}>
                            AI Risk: {imageAnalysis.overallRiskScore}/10
                          </Badge>
                        )}
                      </div>
                      <img 
                        src={formData.screenshot_url} 
                        alt="Pattern screenshot preview" 
                        className="w-full h-48 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* AI Analysis Results */}
                {(patternValidation || imageAnalysis) && (
                  <div className="space-y-4">
                    {/* Pattern Validation Results */}
                    {patternValidation && (
                      <div className="space-y-3 p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Pattern Analysis</span>
                          <Badge variant="outline">
                            {Math.round(patternValidation.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        
                        {patternValidation.similarPatterns.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Similar patterns found:</p>
                            <div className="flex flex-wrap gap-1">
                              {patternValidation.similarPatterns.map((pattern, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-red-600">
                              {patternValidation.riskAssessment.severity}/5
                            </div>
                            <div className="text-xs text-muted-foreground">Severity</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-orange-600">
                              {patternValidation.riskAssessment.userImpact}/5
                            </div>
                            <div className="text-xs text-muted-foreground">User Impact</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-yellow-600">
                              {patternValidation.riskAssessment.legalRisk}/5
                            </div>
                            <div className="text-xs text-muted-foreground">Legal Risk</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Analysis Results */}
                    {imageAnalysis && imageAnalysis.isValid && (
                      <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">AI Image Analysis</span>
                          <Badge variant="outline">
                            {Math.round(imageAnalysis.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant={imageAnalysis.overallRiskScore > 5 ? 'destructive' : 'secondary'}>
                            Risk: {imageAnalysis.overallRiskScore}/10
                          </Badge>
                        </div>
                        
                        {imageAnalysis.detectedPatterns.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Detected Dark Patterns ({imageAnalysis.detectedPatterns.length}):</p>
                            <div className="space-y-2">
                              {imageAnalysis.detectedPatterns.map((pattern, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div>
                                    <span className="text-sm font-medium capitalize">
                                      {pattern.type.replace('_', ' ')}
                                    </span>
                                    <p className="text-xs text-muted-foreground">{pattern.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={pattern.severity > 3 ? 'destructive' : 'secondary'}>
                                      {pattern.severity}/5
                                    </Badge>
                                    <Badge variant="outline">
                                      {Math.round(pattern.confidence * 100)}%
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {imageAnalysis.analysisDetails.suspiciousElements.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Suspicious Elements:</p>
                            <div className="flex flex-wrap gap-1">
                              {imageAnalysis.analysisDetails.suspiciousElements.map((element, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {element.element} ({element.riskLevel})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/patterns')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || validatingPattern || analyzingImage}
                    className="flex-1"
                  >
                    {loading ? 'Submitting...' : validatingPattern ? 'Validating...' : analyzingImage ? 'Analyzing...' : 'Submit Pattern'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Submit;