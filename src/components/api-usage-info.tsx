"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ApiUsageInfoProps {
  provider: string;
  className?: string;
}
export function ApiUsageInfo({
  provider,
  className
}: ApiUsageInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [usageData, setUsageData] = useState({
    requestsToday: 0,
    requestsLimit: 100,
    tokensUsed: 0
  });

  // This would normally fetch real usage data from an API
  // For now, we'll simulate it with mock data
  useEffect(() => {
    // Simulate API usage data
    const mockData = {
      requestsToday: Math.floor(Math.random() * 50),
      requestsLimit: 100,
      tokensUsed: Math.floor(Math.random() * 50000)
    };
    setUsageData(mockData);
  }, [provider]);
  const usagePercentage = usageData.requestsToday / usageData.requestsLimit * 100;
  const isNearLimit = usagePercentage > 80;
  return <div className={cn("bg-card border border-border rounded-lg overflow-hidden", className)} data-unique-id="a11f07d3-6723-427a-901a-e6fb3ecbcc16" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors" data-unique-id="ac05f4e0-3020-4412-8a39-192ef15d6a21" data-file-name="components/api-usage-info.tsx">
        <div className="flex items-center gap-2" data-unique-id="bffe4d6e-98df-4de9-b143-e5f48d666936" data-file-name="components/api-usage-info.tsx">
          <Zap className={cn("w-4 h-4", isNearLimit ? "text-amber-500" : "text-primary")} />
          <span className="font-medium text-sm" data-unique-id="b0dfbc26-6f11-47a2-9711-42803a5f646d" data-file-name="components/api-usage-info.tsx"><span className="editable-text" data-unique-id="7e5ffb12-5c5e-4e7b-b9fe-c569e71e8ad1" data-file-name="components/api-usage-info.tsx">API Usage</span></span>
        </div>
        
        <div className="flex items-center gap-2" data-unique-id="c61bc3cc-3a27-4251-9740-31da9e245a21" data-file-name="components/api-usage-info.tsx">
          <div className="text-xs text-muted-foreground" data-unique-id="73ae31d7-f286-4bee-b30b-8e1c0c6738ae" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">
            {usageData.requestsToday}<span className="editable-text" data-unique-id="aa40057c-7f22-4f93-9a78-e47e4f053b3a" data-file-name="components/api-usage-info.tsx">/</span>{usageData.requestsLimit}<span className="editable-text" data-unique-id="637cf39c-2098-4a29-acee-47767aa4f2bd" data-file-name="components/api-usage-info.tsx"> requests
          </span></div>
          
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden" data-unique-id="f11b5a6e-dd80-488a-9b4c-45c2f60cfb23" data-file-name="components/api-usage-info.tsx">
            <div className={cn("h-full rounded-full", isNearLimit ? "bg-amber-500" : "bg-primary")} style={{
            width: `${usagePercentage}%`
          }} data-unique-id="158504e9-a582-48d2-b08c-43ed5c9d6192" data-file-name="components/api-usage-info.tsx" />
          </div>
        </div>
      </button>
      
      {isExpanded && <motion.div initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: 'auto'
    }} exit={{
      opacity: 0,
      height: 0
    }} className="px-4 pb-4" data-unique-id="c23bc18c-1f60-43d6-afc5-5156e5be426a" data-file-name="components/api-usage-info.tsx">
          <div className="space-y-3 text-sm" data-unique-id="95e333b7-1f70-4671-b45c-f60038016431" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">
            <div className="flex justify-between" data-unique-id="664424aa-c95d-4d1d-8c2d-f390ac5c80d6" data-file-name="components/api-usage-info.tsx">
              <span className="text-muted-foreground" data-unique-id="a674f232-815f-42ee-b78e-00e981315556" data-file-name="components/api-usage-info.tsx"><span className="editable-text" data-unique-id="6b2ede6c-4bea-44cf-aaa2-229d7857ea12" data-file-name="components/api-usage-info.tsx">Provider</span></span>
              <span data-unique-id="7d7b0bcd-ed50-49cc-98ea-b604458d1f66" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">{provider}</span>
            </div>
            
            <div className="flex justify-between" data-unique-id="5c12599e-7cc6-4093-9fd2-f75913dbe781" data-file-name="components/api-usage-info.tsx">
              <span className="text-muted-foreground" data-unique-id="fde36d89-15aa-47c0-9814-eba93747baba" data-file-name="components/api-usage-info.tsx"><span className="editable-text" data-unique-id="80dd7930-e74a-42fe-94fe-49974393fe8f" data-file-name="components/api-usage-info.tsx">Requests Today</span></span>
              <span data-unique-id="57c95649-e01a-4694-861c-c0b762b0ad3b" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">{usageData.requestsToday}<span className="editable-text" data-unique-id="6f89f25d-e20e-47ae-9af9-844581040c75" data-file-name="components/api-usage-info.tsx">/</span>{usageData.requestsLimit}</span>
            </div>
            
            <div className="flex justify-between" data-unique-id="b53ad12e-55b6-4eb5-8bde-ac7931ddc9f7" data-file-name="components/api-usage-info.tsx">
              <span className="text-muted-foreground" data-unique-id="4d158a7e-9440-43ec-9691-9d4b0e755ffc" data-file-name="components/api-usage-info.tsx"><span className="editable-text" data-unique-id="923df57c-7668-410a-b559-48fc29b46315" data-file-name="components/api-usage-info.tsx">Tokens Used</span></span>
              <span data-unique-id="665b2e91-00f1-43ba-a8d0-742bbd08d1bb" data-file-name="components/api-usage-info.tsx" data-dynamic-text="true">{usageData.tokensUsed.toLocaleString()}</span>
            </div>
            
            {isNearLimit && <div className="flex items-start gap-2 bg-amber-500/10 dark:bg-amber-500/20 p-2 rounded-md" data-unique-id="f14ab527-2d6f-4c4a-8216-6221c5fba711" data-file-name="components/api-usage-info.tsx">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs" data-unique-id="b2ec7ac5-9495-4ea1-ae67-7c546c455251" data-file-name="components/api-usage-info.tsx"><span className="editable-text" data-unique-id="8c8c544d-bc58-43f9-814c-642ade331540" data-file-name="components/api-usage-info.tsx">You're approaching your daily API usage limit. Consider upgrading your plan for unlimited access.</span></p>
              </div>}
          </div>
        </motion.div>}
    </div>;
}