import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { trackSignupAttempt } from "@/lib/analytics";
import { useFeatureFlag } from "@/lib/featureFlags";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  gdprConsent: z.boolean()
    .refine((val) => val === true, {
      message: "You must consent to receive email communications",
    }),
  source: z.string().optional(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function SignupCTA() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmailAlertsEnabled = useFeatureFlag('emailAlerts', false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      gdprConsent: false,
      source: "website_cta"
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    console.log("Form submission attempted. Email alerts enabled:", isEmailAlertsEnabled);
    console.log("Form data:", data);
    
    if (!isEmailAlertsEnabled) {
      console.log("Email alerts disabled, showing toast message");
      toast({
        title: "Email alerts coming soon",
        description: "This feature is not available yet. Please check back later.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Sending API request to /api/subscribe");
      // Call our API endpoint to store the email
      const response = await apiRequest("POST", "/api/subscribe", data);
      console.log("API response:", response);
      
      toast({
        title: "Success!",
        description: "You've been added to our mailing list.",
      });
      
      form.reset();
      trackSignupAttempt(true);
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
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
            </div>
            
            <FormField
              control={form.control}
              name="gdprConsent"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="gdpr-consent"
                      className="h-6 w-6 rounded-sm text-primary bg-white border-primary border data-[state=checked]:bg-primary data-[state=checked]:border-white"
                    />
                  </FormControl>
                  <div className="text-sm text-white text-opacity-90 text-left">
                    I consent to receiving email communications about tariff changes and related updates. 
                    See our <span onClick={() => window.location.href="/about#privacy"} className="underline hover:text-primary cursor-pointer">Privacy Policy</span>.
                    <FormMessage className="text-white text-opacity-90 block mt-1" />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <p className="mt-4 text-sm text-white text-opacity-80">
          We'll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
