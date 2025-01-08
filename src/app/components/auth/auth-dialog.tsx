import LoginTabContent from "@/app/components/auth/login-tab-content";
import SignupTabContent from "@/app/components/auth/signup-tab-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="w-full"
                >
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-96 sm:max-w-[400px]">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger
                            className="px-10"
                            value="login"
                        >
                            Login
                        </TabsTrigger>
                        <TabsTrigger
                            className="px-10"
                            value="signup"
                        >
                            Sign up
                        </TabsTrigger>
                    </TabsList>
                    <hr className="-mx-4 my-4 border-neutral-200" />
                    <TabsContent value="login">
                        <LoginTabContent />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignupTabContent />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
