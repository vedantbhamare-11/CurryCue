"use client";

import { motion } from 'framer-motion';
import { Mic, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
export default function CookingCommandsPage() {
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950" data-unique-id="ca66ba09-421d-4ec8-8827-97551471ead7" data-file-name="app/cooking-commands/page.tsx">
      <main className="container mx-auto px-4 py-8" data-unique-id="522744e0-6252-40ff-84d2-e14cf76ad5df" data-file-name="app/cooking-commands/page.tsx">
        <div className="mb-8" data-unique-id="0a3d536d-bd10-4c96-8890-ec9e0f0c571d" data-file-name="app/cooking-commands/page.tsx">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4" data-unique-id="75b31d3c-6284-43fa-bcbe-2df3a4af91e1" data-file-name="app/cooking-commands/page.tsx">
            <ArrowLeft className="w-4 h-4" />
            <span data-unique-id="28f93ad4-2d58-4e73-8da5-c9049953205b" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="de2948e6-8142-4b9d-aa8c-f08f21f56dd5" data-file-name="app/cooking-commands/page.tsx">Back to home</span></span>
          </Link>
          
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-3xl md:text-4xl font-bold mb-2" data-unique-id="faba11c3-dd90-4397-a5a6-46087ae8f254" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="051c528b-7028-40c0-9f63-0e296f56371f" data-file-name="app/cooking-commands/page.tsx">
            Voice Commands Reference
          </span></motion.h1>
          <p className="text-muted-foreground" data-unique-id="c8623226-21b4-450d-9ca0-42732fcf3926" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="2c225c72-1bbe-4d4a-b7c3-0750ada26272" data-file-name="app/cooking-commands/page.tsx">
            Complete list of voice commands available in cooking mode
          </span></p>
        </div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border mb-8" data-unique-id="4023d5f6-ebd6-4abb-aa93-295f351f7a54" data-file-name="app/cooking-commands/page.tsx">
          <div className="flex items-center gap-3 mb-6" data-unique-id="386bc1ea-076d-4cde-82fb-8de792313716" data-file-name="app/cooking-commands/page.tsx">
            <div className="bg-primary/10 p-3 rounded-full" data-unique-id="9c0a86ff-b9be-4684-ad0a-c293a2a0ed5a" data-file-name="app/cooking-commands/page.tsx">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div data-unique-id="655121bb-9cf2-4eb9-9373-c13f3c35e601" data-file-name="app/cooking-commands/page.tsx">
              <h2 className="text-xl font-bold" data-unique-id="6637dc96-8ccd-49aa-91c9-43cd88e3e84c" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="f18cebf1-f835-4a45-8672-18eae3aa3553" data-file-name="app/cooking-commands/page.tsx">Voice Command System</span></h2>
              <p className="text-muted-foreground" data-unique-id="87610ac0-61b8-4385-a542-4ebc6ef7f925" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8c0be377-510b-4f89-86f7-beb235369ad2" data-file-name="app/cooking-commands/page.tsx">Hands-free cooking with voice control</span></p>
            </div>
          </div>
          
          <p className="mb-6" data-unique-id="49560608-df29-4542-9528-4d3f27ceb399" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="a2050d1b-da0b-4a77-a88f-28c0d934164b" data-file-name="app/cooking-commands/page.tsx">
            The voice command system allows you to control the cooking interface without touching your device.
            This is especially useful when your hands are busy or messy while cooking. Simply enable voice commands
            in the cooking mode and speak clearly to navigate through the recipe.
          </span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="68149a0a-78d5-409a-8315-708512de5688" data-file-name="app/cooking-commands/page.tsx">
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="537c6aa6-f20c-44a2-bcd6-193932c2ba8f" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="27745f37-7a5f-4b82-808d-53fc90b0f50a" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="6c4de0cc-498b-42f5-9335-d6926c65b44f" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="937bda4a-62bd-4c17-ab46-afdd98fd4e20" data-file-name="app/cooking-commands/page.tsx">1</span></span><span className="editable-text" data-unique-id="7af0b464-560c-44de-aaaf-bed2f6cbe013" data-file-name="app/cooking-commands/page.tsx">
                Step Navigation Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="ce59540d-c20b-4ce4-b78f-4fcc8caeadab" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="8732edb7-c012-41be-9bed-93af9c92cea0" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="41713dc9-8113-4136-828b-4809acb67dce" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="bd6afaaa-ba8f-4616-b863-bcdb1a4c914f" data-file-name="app/cooking-commands/page.tsx">"Next step" / "Go forward"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="e575cdaf-2e88-4100-a3d2-8fba72af8eef" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="cd83493a-0456-4cdb-8d76-9569ba7c52d7" data-file-name="app/cooking-commands/page.tsx">Move to the next step in the recipe</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="a0f5b7a7-1856-4bdc-b1e9-1f3cd5bfd4cc" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="ce8b9d08-6794-4e6c-b51a-d666524c2751" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="ac0c408c-380d-4c64-98f5-56d95d31ae0a" data-file-name="app/cooking-commands/page.tsx">"Previous step" / "Go back"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="89dc70c1-0fe0-4509-9035-2dc860b1f47c" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="4eb5070f-547f-4b73-bf32-2d60283f44a7" data-file-name="app/cooking-commands/page.tsx">Return to the previous step</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="1b97c5fa-8b09-4a31-9d79-8e91c0cdf080" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="08142f6e-3770-4f4e-9f57-018a682c9bc7" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="648631d0-e3cd-40c4-afc9-3d16cafba9a7" data-file-name="app/cooking-commands/page.tsx">"Go to step [number]" / "Jump to step [number]"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="3e2a6988-1b29-46c3-bd1d-a9d9dc06824b" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="d5ed2763-a85e-4525-bcc0-d5aa11301abd" data-file-name="app/cooking-commands/page.tsx">Navigate directly to a specific step</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="2ead0d75-30c2-4b4b-91b4-822fad0ceb84" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="bd7667bd-7420-41e8-a4f2-77076a0f1e04" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="db75f85b-3239-4d3e-b171-9b28dbffa2d8" data-file-name="app/cooking-commands/page.tsx">"Read step" / "Repeat step" / "What does it say"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="bccc9802-2585-4b93-a7be-1091162c28c9" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="4662013c-d3b2-44bd-8fd7-666af5e36f75" data-file-name="app/cooking-commands/page.tsx">Have the current step read aloud</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="f78f51b8-cf22-4c3a-9824-8cd261a3fd2a" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="562a69f7-bbb0-4dbc-a536-dc6b4e20809f" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="20c96837-d188-427b-8c08-a43317254112" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="a7d352f6-fb6c-44a6-9308-108fede4dcc6" data-file-name="app/cooking-commands/page.tsx">2</span></span><span className="editable-text" data-unique-id="57c39ac9-215c-470e-a189-e0f08ffe386d" data-file-name="app/cooking-commands/page.tsx">
                Ingredient Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="75e62f90-3e0b-4053-8d6a-b2810022b357" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="8639c6c5-b5b3-4e8f-b6ea-93ce48588f6d" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="4446bf38-13b7-44fc-b8c1-c1c870a98ca8" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="3fbc8c26-600e-43ba-a732-73635d188c10" data-file-name="app/cooking-commands/page.tsx">"Next ingredient" / "Following ingredient"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="631b5b83-e4ad-48c3-82ab-d24181260dbe" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="779bb19c-7377-4217-8b44-d67cea21680b" data-file-name="app/cooking-commands/page.tsx">Move to the next ingredient in the list</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="da081f09-3ccf-4d0e-af75-8fa9e861e561" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="b44a72ac-1476-426f-bd94-69fdac22bd89" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="b26f5edd-37e4-4a89-86d1-7819147b1f0d" data-file-name="app/cooking-commands/page.tsx">"Previous ingredient" / "Last ingredient"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="3b0e679a-238a-480d-b865-f359abae144a" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="f8cfa9b6-8455-444c-bcbe-cc0f052445f5" data-file-name="app/cooking-commands/page.tsx">Go back to the previous ingredient</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="feafa71f-2586-4faf-81ed-8056be431e1e" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="9d06e5a0-2ebc-4bac-9ff7-f3d51013f94b" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="7128a1cf-e977-49ff-b1f0-a00a29c97e64" data-file-name="app/cooking-commands/page.tsx">"List ingredients" / "Show ingredients" / "What ingredients"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="500fb8a3-1461-48bc-8f13-b64d1fcb6b50" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="0a00b314-f91d-429d-9df4-5680dc3dc29c" data-file-name="app/cooking-commands/page.tsx">Display and read all ingredients</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="502e5f4f-7a66-4e04-92e5-c0b0301b1391" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="a2861d13-a118-46e8-8351-93e58333a31c" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="b96eb4f1-1d05-4ee7-811d-d0df66ac799c" data-file-name="app/cooking-commands/page.tsx">"Read ingredient [number]" / "Tell me about ingredient [number]"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="edb5af04-d927-444a-9899-c37a5f5ea66b" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="f8bf66cc-a861-498d-be8c-ba09bd020723" data-file-name="app/cooking-commands/page.tsx">Read a specific ingredient by its number</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="addf092e-5d79-4837-8447-1eca7f94cda6" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="6f54688b-4ed1-4600-a2db-2926cfdf72f8" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="ca457798-e947-4a2f-a1d0-c2c77a53ceac" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8db2cdbf-7b21-4b7a-8853-fe550fa23af2" data-file-name="app/cooking-commands/page.tsx">3</span></span><span className="editable-text" data-unique-id="d80d936c-3613-42be-9304-467841c066e1" data-file-name="app/cooking-commands/page.tsx">
                Timer Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="a12cb327-8d75-41ae-b021-26b4d12753e2" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="45b0a651-5175-498f-bfa6-c433276332c7" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="63a85ece-9100-44b6-a2c0-06570ae1d881" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="0158d095-64a4-4bd2-9b58-d0ce28d87d61" data-file-name="app/cooking-commands/page.tsx">"Start timer [number] minutes" / "Set timer for [number] minutes"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="a49d4629-ab80-4b0f-9621-e1c8914f5909" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="333c26fd-be96-45cc-bb55-a791c48f9000" data-file-name="app/cooking-commands/page.tsx">Start a countdown timer for the specified minutes</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="2ca9b38c-2883-4b2c-8d95-9a0937d6adba" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="087584d5-7f5f-4f6a-bb8e-bb7ac017c1ba" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="30fc76e8-10eb-425e-b443-c8d732a31edf" data-file-name="app/cooking-commands/page.tsx">"Stop timer" / "Cancel timer" / "End timer"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="46ed9212-9505-4d14-8086-72201322adc7" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="10eaa202-3e77-4e01-8eff-ef55a76f958b" data-file-name="app/cooking-commands/page.tsx">Stop the currently running timer</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="4403859b-da69-4e4b-b7e2-743881c65284" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="c1389da9-d635-4cf1-9746-7d769349392d" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="48d92058-d665-4ab6-996f-2286f9da04f1" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="27f113b8-09a4-401e-b198-db75c6ae6a03" data-file-name="app/cooking-commands/page.tsx">4</span></span><span className="editable-text" data-unique-id="86c45108-bce1-4157-9e66-ddc8097b6585" data-file-name="app/cooking-commands/page.tsx">
                Display & Control Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="4791c111-5195-4893-918a-e35cd0401b48" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="19f68b9f-1326-456c-999c-3cf2515add79" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="aecdc5bb-2a21-4e50-9efb-ac1d535fbd71" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="84d74844-2792-4576-9364-7dda3f5e01f9" data-file-name="app/cooking-commands/page.tsx">"Fullscreen" / "Full screen"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="cec41bf3-332e-4d59-9566-fe0103937915" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="e649b16e-1737-4e78-b1c2-3daf348fcaa4" data-file-name="app/cooking-commands/page.tsx">Toggle fullscreen mode</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="f08c4a94-e9db-49de-a20f-27dd10af610b" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="dc5d3a07-658d-49ac-8e50-7608050b394d" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="66fdfe85-d4b5-4099-b136-0570f4c13da3" data-file-name="app/cooking-commands/page.tsx">"Exit" / "Close" / "Quit"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="4ed10758-3e4b-47e9-8805-032988868850" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="169fd0a7-d3c9-4ba1-86e3-503bbb8a8ae9" data-file-name="app/cooking-commands/page.tsx">Exit the cooking mode</span></p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8" data-unique-id="ccfd6b42-5d98-4025-98a8-8de395287ffd" data-file-name="app/cooking-commands/page.tsx">
          <h3 className="font-bold text-lg mb-4" data-unique-id="e46ed52e-f9d0-4f96-83c0-34775491ef60" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="b01d9639-f57e-473d-b3e8-8e5c1ebef779" data-file-name="app/cooking-commands/page.tsx">Tips for Better Voice Recognition</span></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="e3005918-60ae-43e8-b6de-ea886447a73a" data-file-name="app/cooking-commands/page.tsx">
            <div className="flex items-start gap-3" data-unique-id="4d32f2cf-0987-4aee-9257-856b227644c3" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="22ba3e02-88d7-4b9d-9edc-3b05a25f9894" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="8ff5c676-f2ef-4990-8bc5-1773c441ff60" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="2afb6206-e4e6-46e7-8947-aa67c5720c61" data-file-name="app/cooking-commands/page.tsx">1</span></span>
              </div>
              <div data-unique-id="d0380b6b-8a21-452b-9b9e-99ca75965832" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="69b5834a-ae4e-422c-93cb-0e6f78bdaa41" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="7fb20164-6a09-4ac9-83c4-efd5f3f0bac1" data-file-name="app/cooking-commands/page.tsx">Speak clearly and at a moderate pace</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="e36ab76d-e008-40ee-94d0-6a7f5a43a53f" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="23f8bf19-326a-4790-ad1e-f7d18d532095" data-file-name="app/cooking-commands/page.tsx">Avoid speaking too quickly or mumbling</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="1a77342e-fb04-4aba-b87b-dca6eaebc569" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="8963f93b-1364-40ea-96ac-2a7f4f5e7585" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="79809f8f-4b00-487b-ad3f-227d1e6fd4e0" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="e02ce161-ffd3-4df9-a7fb-0406fbbfe30c" data-file-name="app/cooking-commands/page.tsx">2</span></span>
              </div>
              <div data-unique-id="5c11f432-2d18-4025-accd-44051ef6a2b9" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="81189557-8896-4670-9211-76177af2206a" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8e92e40c-1fa4-40a4-a1b3-64bf29636f5f" data-file-name="app/cooking-commands/page.tsx">Reduce background noise</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="86ad97c5-18c7-4c86-ab4a-4cea30d0d00e" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="10695c32-467e-4a78-820b-1c550f0026f4" data-file-name="app/cooking-commands/page.tsx">Try to minimize kitchen appliance noise when giving commands</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="2d8ab5a8-9a3f-46bc-b9a6-b31a2f316517" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="e1ee497c-9e4d-4687-94e8-0551ea14971d" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="6a3385cf-2ba7-4fe2-8409-70967fa0f384" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="bc689c2c-4820-4bad-83f8-6a53cd116da1" data-file-name="app/cooking-commands/page.tsx">3</span></span>
              </div>
              <div data-unique-id="83cdc11b-dc25-47c2-a9a0-29bc33d6c02b" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="04121de8-6be3-4386-a412-076b0a671d31" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="9bad4c10-d62e-4567-8f74-9f97921c1b5f" data-file-name="app/cooking-commands/page.tsx">Use the exact command phrases</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="c9c4d45f-d46f-4ee8-bb1b-64f91727413e" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="d4e4f392-3e7f-419d-aa31-f9e90aefbc26" data-file-name="app/cooking-commands/page.tsx">The system works best when you use the exact phrases listed</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="e73c6b15-b659-4746-9afd-8a5b3d6129d2" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="86711979-3d7a-4c1b-a80f-4c9ee69cdae8" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="ff8d297e-17c5-4390-b972-96b0533cb2ff" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="c437a76e-c25d-4fd6-ae8f-5f3e10da418a" data-file-name="app/cooking-commands/page.tsx">4</span></span>
              </div>
              <div data-unique-id="a7f8a3c1-298b-4187-a082-eef40848beea" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="2aebd482-a1d4-4113-b154-db90a2866c6c" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="cef68050-5583-4e76-8087-a8739650a74c" data-file-name="app/cooking-commands/page.tsx">Wait for feedback</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="4da7e163-d832-49af-a805-e24e1f044269" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8a155a1e-9682-4304-954d-27281219d256" data-file-name="app/cooking-commands/page.tsx">After giving a command, wait for visual or audio confirmation</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>;
}