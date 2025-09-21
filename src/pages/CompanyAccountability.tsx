import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  ExternalLink,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CompanyReport {
  id: string;
  company_name: string;
  total_patterns: number;
  severity_score: number;
  user_impact: number;
  last_updated: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
  patterns: {
    id: string;
    title: string;
    pattern_type: string;
    severity: number;
    reports_count: number;
  }[];
}

interface RegulatoryReport {
  id: string;
  company_name: string;
  report_type: string;
  status: string;
  submitted_date: string;
  response_date?: string;
  outcome?: string;
}

const CompanyAccountability = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyReport[]>([]);
  const [regulatoryReports, setRegulatoryReports] = useState<RegulatoryReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyReports();
    fetchRegulatoryReports();
  }, []);

  const fetchCompanyReports = async () => {
    // This would typically fetch from a companies table with aggregated pattern data
    // For now, we'll simulate with sample data
    const sampleCompanies: CompanyReport[] = [
      {
        id: '1',
        company_name: 'StreamFlix India',
        total_patterns: 15,
        severity_score: 4.2,
        user_impact: 1250,
        last_updated: '2024-01-15',
        status: 'active',
        patterns: [
          { id: '1', title: 'Hidden Auto-Renewal', pattern_type: 'forced_renewal', severity: 4, reports_count: 45 },
          { id: '2', title: 'Confusing Cancellation', pattern_type: 'cancellation_trap', severity: 5, reports_count: 32 },
          { id: '3', title: 'Hidden Processing Fees', pattern_type: 'hidden_cost', severity: 3, reports_count: 28 }
        ]
      },
      {
        id: '2',
        company_name: 'EduLearn Pro',
        total_patterns: 8,
        severity_score: 3.8,
        user_impact: 890,
        last_updated: '2024-01-12',
        status: 'investigating',
        patterns: [
          { id: '4', title: 'Misleading Pricing Tiers', pattern_type: 'misleading_language', severity: 4, reports_count: 67 },
          { id: '5', title: 'Pre-checked Premium Features', pattern_type: 'hidden_cost', severity: 3, reports_count: 23 }
        ]
      },
      {
        id: '3',
        company_name: 'ShopMax India',
        total_patterns: 12,
        severity_score: 3.5,
        user_impact: 2100,
        last_updated: '2024-01-10',
        status: 'resolved',
        patterns: [
          { id: '6', title: 'Pre-checked Add-ons', pattern_type: 'hidden_cost', severity: 3, reports_count: 89 },
          { id: '7', title: 'Countdown Pressure', pattern_type: 'misleading_language', severity: 2, reports_count: 15 }
        ]
      }
    ];
    
    setCompanies(sampleCompanies);
    setLoading(false);
  };

  const fetchRegulatoryReports = async () => {
    // This would fetch from a regulatory_reports table
    const sampleReports: RegulatoryReport[] = [
      {
        id: '1',
        company_name: 'StreamFlix India',
        report_type: 'Consumer Protection Violation',
        status: 'Under Review',
        submitted_date: '2024-01-10',
        response_date: '2024-01-15'
      },
      {
        id: '2',
        company_name: 'EduLearn Pro',
        report_type: 'Deceptive Marketing',
        status: 'Investigation Ongoing',
        submitted_date: '2024-01-05'
      }
    ];
    
    setRegulatoryReports(sampleReports);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'investigating': return 'default';
      case 'resolved': return 'secondary';
      case 'dismissed': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityColor = (score: number) => {
    if (score >= 4) return 'text-red-600';
    if (score >= 3) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const generateRegulatoryReport = async (companyName: string) => {
    if (!user) return;
    
    // This would create a regulatory report
    const report = {
      company_name: companyName,
      report_type: 'Dark Pattern Violation',
      status: 'Submitted',
      submitted_date: new Date().toISOString(),
      user_id: user.id
    };
    
    // In a real implementation, this would save to the database
    
    // Add to local state for demo
    setRegulatoryReports(prev => [...prev, report as RegulatoryReport]);
  };

  const exportCompanyData = (company: CompanyReport) => {
    const data = {
      company_name: company.company_name,
      total_patterns: company.total_patterns,
      severity_score: company.severity_score,
      user_impact: company.user_impact,
      patterns: company.patterns,
      report_date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${company.company_name.replace(/\s+/g, '_')}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company accountability data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Building2 className="w-10 h-10 text-red-600" />
            Company Accountability
          </h1>
          <p className="text-xl text-gray-600">
            Track companies using dark patterns and hold them accountable for deceptive practices.
          </p>
        </div>

        <Tabs defaultValue="companies" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">Company Reports</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Actions</TabsTrigger>
            <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="mt-8">
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Issues</SelectItem>
                    <SelectItem value="investigating">Under Investigation</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {company.company_name}
                          <Badge variant={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Last updated: {new Date(company.last_updated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateRegulatoryReport(company.company_name)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Report to Regulators
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => exportCompanyData(company)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{company.total_patterns}</div>
                        <div className="text-sm text-gray-600">Dark Patterns</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSeverityColor(company.severity_score)}`}>
                          {company.severity_score.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Severity Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{company.user_impact}</div>
                        <div className="text-sm text-gray-600">Users Affected</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {company.patterns.reduce((sum, p) => sum + p.reports_count, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Reports</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Reported Patterns:</h4>
                      <div className="space-y-2">
                        {company.patterns.map((pattern) => (
                          <div key={pattern.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{pattern.title}</div>
                              <div className="text-sm text-gray-600">{pattern.pattern_type}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={pattern.severity >= 4 ? 'destructive' : 'default'}>
                                Severity: {pattern.severity}/5
                              </Badge>
                              <span className="text-sm text-gray-600">{pattern.reports_count} reports</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regulatory" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Regulatory Reports & Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulatoryReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.company_name}</h4>
                        <p className="text-sm text-gray-600">{report.report_type}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(report.submitted_date).toLocaleDateString()}
                          {report.response_date && (
                            <span> • Response: {new Date(report.response_date).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{report.status}</Badge>
                        {report.outcome && (
                          <p className="text-sm text-gray-600 mt-1">{report.outcome}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Companies</p>
                      <p className="text-2xl font-bold">{companies.length}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Issues</p>
                      <p className="text-2xl font-bold text-red-600">
                        {companies.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Users Affected</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {companies.reduce((sum, c) => sum + c.user_impact, 0).toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Regulatory Reports</p>
                      <p className="text-2xl font-bold text-green-600">{regulatoryReports.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Top Offending Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies
                      .sort((a, b) => b.severity_score - a.severity_score)
                      .slice(0, 5)
                      .map((company, index) => (
                        <div key={company.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-red-600">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{company.company_name}</p>
                              <p className="text-sm text-gray-600">{company.total_patterns} patterns</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">{company.severity_score.toFixed(1)}</p>
                            <p className="text-xs text-gray-600">severity</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pattern Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['forced_renewal', 'cancellation_trap', 'hidden_cost', 'misleading_language'].map((type) => {
                      const count = companies.reduce((sum, company) => 
                        sum + company.patterns.filter(p => p.pattern_type === type).length, 0
                      );
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${(count / 20) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyAccountability;
