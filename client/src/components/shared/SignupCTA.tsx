import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trackSignupAttempt } from "@/lib/analytics";
import { useEmailAlertsFeature } from "@/lib/featureFlags";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function SignupCTA() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmailAlertsEnabled = useEmailAlertsFeature();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    if (!isEmailAlertsEnabled) {
      toast({
        title: "Email alerts coming soon",
        description: "This feature is not available yet. Please check back later.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the email to a backend endpoint
      // await apiRequest("POST", "/api/subscribe", { email: data.email });
      
      toast({
        title: "Success!",
        description: "You've been added to our mailing list.",
      });
      
      form.reset();
      trackSignupAttempt(true);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to sign up. Please try again later.",
        variant: "destructive",
      });
      trackSignupAttempt(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4">
          Stay Updated on Tariff Changes
        </h2>
        <p className="mt-2 text-lg text-white text-opacity-90 max-w-3xl mx-auto mb-8">
          Sign up to receive alerts about tariff implementation dates, price changes, and personalized product recommendations.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="px-4 py-3 rounded-md bg-white text-gray-900 w-full" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white text-opacity-90 text-xs mt-1" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              variant="secondary" 
              className="py-3 px-6" 
              disabled={isSubmitting || !isEmailAlertsEnabled}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
        
        <p className="mt-4 text-sm text-white text-opacity-80">
          We'll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
