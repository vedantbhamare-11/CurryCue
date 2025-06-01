"use client";

import { motion } from 'framer-motion';
import { Mic, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
export default function CookingCommandsPage() {
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-amber-950" data-unique-id="49058b0d-5222-4efe-8dab-a8089139d50a" data-file-name="app/cooking-commands/page.tsx">
      <main className="container mx-auto px-4 py-8" data-unique-id="058a124d-5616-48ae-9ced-e94237d4ea04" data-file-name="app/cooking-commands/page.tsx">
        <div className="mb-8" data-unique-id="208b8949-57d7-4ff8-ab25-8a9ffdb54a72" data-file-name="app/cooking-commands/page.tsx">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4" data-unique-id="87650fd0-21c3-40e5-bb47-1f95f766616e" data-file-name="app/cooking-commands/page.tsx">
            <ArrowLeft className="w-4 h-4" />
            <span data-unique-id="d4919b1d-5188-4b70-8760-baca276975eb" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="d3cb3f93-8111-4c1f-b3e2-9bf784bd7156" data-file-name="app/cooking-commands/page.tsx">Back to home</span></span>
          </Link>
          
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-3xl md:text-4xl font-bold mb-2" data-unique-id="9a093cd8-3e23-4972-8e46-9a1ca70c9621" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="a0c81b3f-efd3-4d0b-a04e-b8969dc090e7" data-file-name="app/cooking-commands/page.tsx">
            Voice Commands Reference
          </span></motion.h1>
          <p className="text-muted-foreground" data-unique-id="dd5a9034-38f7-499d-a6c9-1205de290a0a" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="44098220-9a7f-4ae3-909e-f9483bb7b1f2" data-file-name="app/cooking-commands/page.tsx">
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
      }} className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border mb-8" data-unique-id="024b9d6d-7a18-4b0c-bc41-0cc7c28b2183" data-file-name="app/cooking-commands/page.tsx">
          <div className="flex items-center gap-3 mb-6" data-unique-id="0eb6326f-0517-4ce1-ae13-76b3346f7a22" data-file-name="app/cooking-commands/page.tsx">
            <div className="bg-primary/10 p-3 rounded-full" data-unique-id="e91d61db-b536-4a82-bb16-53cb21c6af22" data-file-name="app/cooking-commands/page.tsx">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div data-unique-id="c1283b29-8926-4beb-a8c0-6865165d91e5" data-file-name="app/cooking-commands/page.tsx">
              <h2 className="text-xl font-bold" data-unique-id="2e60b623-4aac-4912-a802-0bae36b6d7fd" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="a561b4fa-e175-4d28-8da0-09a9c2679bed" data-file-name="app/cooking-commands/page.tsx">Voice Command System</span></h2>
              <p className="text-muted-foreground" data-unique-id="27f7d869-4a65-4659-b43b-714d78e198a3" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="34e8cd94-2a3e-4106-ace0-187e83bd61f4" data-file-name="app/cooking-commands/page.tsx">Hands-free cooking with voice control</span></p>
            </div>
          </div>
          
          <p className="mb-6" data-unique-id="35571cd8-c46f-4d8d-8d51-df112ca41b4d" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="ba8c21bb-e179-48f7-a461-142052d7b683" data-file-name="app/cooking-commands/page.tsx">
            The voice command system allows you to control the cooking interface without touching your device.
            This is especially useful when your hands are busy or messy while cooking. Simply enable voice commands
            in the cooking mode and speak clearly to navigate through the recipe.
          </span></p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="26c6a7ea-f585-4d7a-83c9-aafdaf909b6b" data-file-name="app/cooking-commands/page.tsx">
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="71219273-c4e2-4644-a83f-e2b29033eace" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="b5b10561-220f-4bb1-8090-1fca4eb31c3f" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="3989d290-dfff-4a5c-a8dd-04bbb9fa9eeb" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8d9002b8-9412-4db6-942a-676a385bdc2a" data-file-name="app/cooking-commands/page.tsx">1</span></span><span className="editable-text" data-unique-id="9f462e59-dd41-4132-8790-0864ce04ff4c" data-file-name="app/cooking-commands/page.tsx">
                Step Navigation Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="ac26c944-bf2e-42b0-a564-f7257560513c" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="0529f428-61dd-4884-9726-98c943d1b8fc" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="c681ec39-30cc-47cb-9d8f-175758b789d5" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="12f7f2ec-7294-479f-a18c-959d610d1a3c" data-file-name="app/cooking-commands/page.tsx">"Next step" / "Go forward"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="f7c98cfc-c9f3-4e56-bea7-027d5f73e477" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="bb4bb1d1-51bc-4f15-8d6b-ee75120800d0" data-file-name="app/cooking-commands/page.tsx">Move to the next step in the recipe</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="c0ec8030-1d2c-4ab7-bed3-7108ddea27f8" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="df43f160-47f0-42da-bdbe-f135ab0188f3" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="49edd0c4-1ba5-43a5-a601-303616256bd3" data-file-name="app/cooking-commands/page.tsx">"Previous step" / "Go back"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="745434a1-aa85-48ea-8236-0c5cb3c4ac9f" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="45b063b1-ff3f-4cb8-bf4b-291f97ce8b88" data-file-name="app/cooking-commands/page.tsx">Return to the previous step</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="c1ab67bc-7e80-4349-83cc-fe027dbd36e2" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="7f864f0e-edeb-4a13-97a4-68458a6f4304" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="af23bf27-c93e-476f-af3e-00b12d473d8d" data-file-name="app/cooking-commands/page.tsx">"Go to step [number]" / "Jump to step [number]"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="608a1b01-69dd-477c-aceb-d98f93adf818" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="d38bcb42-5618-4e05-b6af-9be7a8e4ef32" data-file-name="app/cooking-commands/page.tsx">Navigate directly to a specific step</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="52b8f482-7028-4334-a038-623b541cca73" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="adf41db7-9691-48be-ba76-70be092a6d2a" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="ad1c57cd-baac-43ea-a583-0d67ad3191d7" data-file-name="app/cooking-commands/page.tsx">"Read step" / "Repeat step" / "What does it say"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="7aba1a63-c0cc-4392-af81-77729092ad48" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="59d1758e-a982-4e79-a275-2b38f020a0f3" data-file-name="app/cooking-commands/page.tsx">Have the current step read aloud</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="3ab67d86-3146-4fc0-a116-bb516be1b8f0" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="4ff511bd-3a60-4944-b87d-9e0de9c14fcf" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="f7f47b6b-7d5f-4431-b73f-76eb902cd0ac" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="319a17bc-454b-4cf3-888b-685ab142df89" data-file-name="app/cooking-commands/page.tsx">2</span></span><span className="editable-text" data-unique-id="52788b39-bca6-45bb-ae52-09db247b4407" data-file-name="app/cooking-commands/page.tsx">
                Ingredient Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="2af9c574-6203-487a-9e99-53484330e44c" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="1947f5f1-1e62-4d66-b750-d0480d046bd6" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="0abf67a0-c9c1-4b42-b802-16e867c1c1f3" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="4944bcde-1076-410a-b3a4-a71c399a0e10" data-file-name="app/cooking-commands/page.tsx">"Next ingredient" / "Following ingredient"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="6e3228c6-9f2b-4c2a-89a9-bf266c9ed531" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="0015e680-ccb8-44b3-ad43-0d05a4f51f60" data-file-name="app/cooking-commands/page.tsx">Move to the next ingredient in the list</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="afe01a2f-fd20-4a48-93a6-7c5698d3e667" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="5f6f8934-94b1-43be-9bdc-fb8f101c5123" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="6b84409c-e57a-43b1-a232-cd5af898d779" data-file-name="app/cooking-commands/page.tsx">"Previous ingredient" / "Last ingredient"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="0ceae683-00af-46bd-aa2e-1ac3820d53f6" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="459b1bfa-ff34-4c55-a0d7-58d0dc06f0ec" data-file-name="app/cooking-commands/page.tsx">Go back to the previous ingredient</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="5eb91e3c-baf4-44a1-be45-98f1d9940899" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="3e3470c6-3341-4680-a4ac-83158675cc9c" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="4d9a2148-47ce-4ba6-b702-55893f9ecdb6" data-file-name="app/cooking-commands/page.tsx">"List ingredients" / "Show ingredients" / "What ingredients"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="a7c3b2bd-7810-454c-9a9a-0fb3f94139ca" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="21856941-2dd4-4e78-91c4-b3d666fd59e0" data-file-name="app/cooking-commands/page.tsx">Display and read all ingredients</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="2f15499e-ad33-4b09-b68f-d06c7ad56d71" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="698659b9-73d0-48bc-8440-5f4789eb3618" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="abf030ad-794e-4606-8d64-e1a749c7190b" data-file-name="app/cooking-commands/page.tsx">"Read ingredient [number]" / "Tell me about ingredient [number]"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="9ba1f99b-833d-4e85-aa13-fee5e5a77d45" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="3c684da1-f787-43c0-b692-d9c53f8fec37" data-file-name="app/cooking-commands/page.tsx">Read a specific ingredient by its number</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="d59fd05d-c47e-4f7f-81a4-2962fadb7a5a" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="ddc37811-d262-4802-a69f-7065e3b75c0f" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="472980d0-2ad0-4836-bb3d-fa19b6ee6e14" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="79395889-b585-4fb6-bae2-6a3d1caec082" data-file-name="app/cooking-commands/page.tsx">3</span></span><span className="editable-text" data-unique-id="06b46938-4304-4593-806e-ac6d46a3df49" data-file-name="app/cooking-commands/page.tsx">
                Timer Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="0b12d1da-6058-4bd4-9ada-ae52dfe42e04" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="6c0c8a74-92dc-4709-b9b0-79b040779c5a" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="b4a6cd04-aa5b-4131-8a01-bfbbc7671c59" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="62892f9b-1ebd-482f-8759-f7decb0f8025" data-file-name="app/cooking-commands/page.tsx">"Start timer [number] minutes" / "Set timer for [number] minutes"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="fa3edcb3-a5ac-46f3-aac1-5ced27848d35" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="b0f7a006-513e-439d-aec5-d56a185d3cea" data-file-name="app/cooking-commands/page.tsx">Start a countdown timer for the specified minutes</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="16e3692c-bcde-4e1b-8d67-e84d358caa36" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="33ce8d86-b859-4faf-ad9e-90bad0988871" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8e312cc1-db7d-4c8b-870a-1e38d650ce6c" data-file-name="app/cooking-commands/page.tsx">"Stop timer" / "Cancel timer" / "End timer"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="f1ab418b-ce0e-4004-8516-b7a16f317949" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="1b684e6e-9cb1-4f52-8739-274973905741" data-file-name="app/cooking-commands/page.tsx">Stop the currently running timer</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-5" data-unique-id="2b99c661-28e6-4ce6-9480-fda094662722" data-file-name="app/cooking-commands/page.tsx">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-unique-id="e260fe5b-652f-4f2f-bee2-87379c701a90" data-file-name="app/cooking-commands/page.tsx">
                <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center" data-unique-id="b5757c42-3914-4933-ada6-cbc70a610355" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="3a0175e7-3503-44b2-b02f-e84ad487ae78" data-file-name="app/cooking-commands/page.tsx">4</span></span><span className="editable-text" data-unique-id="2d83abd2-9ea1-4da0-b49b-9ba30a70f584" data-file-name="app/cooking-commands/page.tsx">
                Display & Control Commands
              </span></h3>
              
              <div className="space-y-3" data-unique-id="6ad84ca5-04b5-4e2f-9539-a35e142278b1" data-file-name="app/cooking-commands/page.tsx">
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="d6b42baf-e303-4ba6-9f9e-3dbad0b4c518" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="be44d78e-9040-4ee0-b6ee-f9cef0d831f3" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="c942f044-7094-42c4-8a4c-8c9d11e16d16" data-file-name="app/cooking-commands/page.tsx">"Fullscreen" / "Full screen"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="21719ff1-13ef-40f8-b955-2ece7cfc1f36" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="f54ef61c-3bef-449d-8f51-66fcc9d5b96e" data-file-name="app/cooking-commands/page.tsx">Toggle fullscreen mode</span></p>
                </div>
                
                <div className="bg-card rounded-lg p-3 border border-border" data-unique-id="cb691f88-1f61-439e-b623-cc6e0b5051cd" data-file-name="app/cooking-commands/page.tsx">
                  <div className="font-medium mb-1" data-unique-id="a4795ad3-2712-4cb6-974c-e922eb43d279" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="698a65d2-57fa-4940-a7b5-a5e53e6e5ec3" data-file-name="app/cooking-commands/page.tsx">"Exit" / "Close" / "Quit"</span></div>
                  <p className="text-sm text-muted-foreground" data-unique-id="ca41657c-e35f-45a0-946f-a8be1ff6c980" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="defc70d6-326d-4cfd-a996-a9b4b76ba0eb" data-file-name="app/cooking-commands/page.tsx">Exit the cooking mode</span></p>
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
      }} className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8" data-unique-id="a56a348e-64d0-47c1-856c-18156d0def5c" data-file-name="app/cooking-commands/page.tsx">
          <h3 className="font-bold text-lg mb-4" data-unique-id="f7b58e1c-6061-4b1d-8736-26357043eb86" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="1fdead15-da66-4342-b3c8-da03ee6b1541" data-file-name="app/cooking-commands/page.tsx">Tips for Better Voice Recognition</span></h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="3c8a5158-5fe1-4b87-aded-89bc72838833" data-file-name="app/cooking-commands/page.tsx">
            <div className="flex items-start gap-3" data-unique-id="84fe58ad-42de-4db5-9bf2-83c083ccd2bf" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="f7792db1-ed1a-4001-b331-45d090ab4a40" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="5396ee39-61c3-479d-adc2-a0c99777a54d" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="b6718c2e-551f-4384-bdb0-aaaba24549ea" data-file-name="app/cooking-commands/page.tsx">1</span></span>
              </div>
              <div data-unique-id="1a0b7433-9705-4d68-b50a-13c2d8e91fbd" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="3dfc934e-420a-4547-b443-ad8230a39fc5" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="32d816d9-c3f8-4f25-be64-d09d291c8954" data-file-name="app/cooking-commands/page.tsx">Speak clearly and at a moderate pace</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="090d53f8-9a9f-4dee-8393-cb8e5a5264df" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="9edfe601-1928-4760-8cd5-9b1482dc0be9" data-file-name="app/cooking-commands/page.tsx">Avoid speaking too quickly or mumbling</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="94d9b9ad-a7f2-4230-bd7d-6741db8b33b2" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="e48b9cb7-4f50-4698-ac6b-3b12da886bea" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="4267677b-9009-44bd-873f-e611f30f736b" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="0408b824-91d7-4669-8151-74caea062c0a" data-file-name="app/cooking-commands/page.tsx">2</span></span>
              </div>
              <div data-unique-id="57826448-956d-4f69-8456-84704446d3f5" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="adbac9bb-298a-48b1-b958-8d29dd6a6588" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="1ef0d694-da8e-41ca-b343-19438390f520" data-file-name="app/cooking-commands/page.tsx">Reduce background noise</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="22318871-6304-42b8-9090-2a705e855cc8" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="f196485c-52de-4ae4-9159-a660864947a6" data-file-name="app/cooking-commands/page.tsx">Try to minimize kitchen appliance noise when giving commands</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="0f60424d-9643-432a-a4b5-bff5611f18ad" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="176d9ee8-d811-414c-ab9b-28b71efc9862" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="f884b920-1c66-471b-8176-2b8d23f00b1e" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="3e2f0062-2a04-49df-b4a9-0560be1ebdf5" data-file-name="app/cooking-commands/page.tsx">3</span></span>
              </div>
              <div data-unique-id="203003df-e769-4b8b-895f-9bb563697a54" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="187434e4-4693-4b1a-87f2-01e9cae8667f" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="67947ac7-2c28-4ceb-9c14-b66a441d46ee" data-file-name="app/cooking-commands/page.tsx">Use the exact command phrases</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="d0c135d4-ab97-44d0-a158-66540ffcf70d" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="82d1b541-e651-40bd-b0b5-c4be0b68c692" data-file-name="app/cooking-commands/page.tsx">The system works best when you use the exact phrases listed</span></p>
              </div>
            </div>
            
            <div className="flex items-start gap-3" data-unique-id="8bb08c0f-9df9-40ea-9d7f-769afc15497c" data-file-name="app/cooking-commands/page.tsx">
              <div className="bg-primary/10 p-2 rounded-full" data-unique-id="2d2d6136-527d-43e3-9c19-79c859f28545" data-file-name="app/cooking-commands/page.tsx">
                <span className="text-primary font-bold" data-unique-id="16a2c183-e387-4b1e-91a1-24f9a3acac34" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="1e5b1096-a5dd-46ee-b6a4-d093488bae6b" data-file-name="app/cooking-commands/page.tsx">4</span></span>
              </div>
              <div data-unique-id="f313ba94-d656-4e07-9c96-7789d2dcb5d1" data-file-name="app/cooking-commands/page.tsx">
                <p className="font-medium" data-unique-id="7b585496-6a94-4bed-90eb-29b9b53ddf89" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="d0833052-1d7b-423f-a798-2f10af1884ca" data-file-name="app/cooking-commands/page.tsx">Wait for feedback</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="835a60fa-e238-492f-9fc7-fa5a998db6e6" data-file-name="app/cooking-commands/page.tsx"><span className="editable-text" data-unique-id="8ee4f888-9120-4e10-9e3c-436d8052de65" data-file-name="app/cooking-commands/page.tsx">After giving a command, wait for visual or audio confirmation</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>;
}