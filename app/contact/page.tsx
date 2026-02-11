"use client";

import { MessageCircle, Instagram, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const subjectValue = watch("subject");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Store in localStorage as mock backend
      const submissions = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
      const newSubmission = {
        ...data,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: "pending",
      };
      submissions.push(newSubmission);
      localStorage.setItem("contact_submissions", JSON.stringify(submissions));

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });

      setIsSubmitted(true);
      reset();

      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again or contact us via WhatsApp.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-center text-muted-foreground mb-12 text-lg">
                        We're here to help! Reach out to us through your preferred platform.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Contact Form */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                                <p className="text-sm text-muted-foreground">
                                  Fill out the form below and we'll get back to you within 24 hours.
                                </p>
                            </div>

                            {isSubmitted && (
                              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-green-900">Message sent successfully!</p>
                                  <p className="text-xs text-green-700 mt-1">We'll respond within 24 hours.</p>
                                </div>
                              </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  {...register("name")}
                                  placeholder="Your name"
                                  className="mt-1"
                                />
                                {errors.name && (
                                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  {...register("email")}
                                  placeholder="your@email.com"
                                  className="mt-1"
                                />
                                {errors.email && (
                                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Select
                                  value={subjectValue}
                                  onValueChange={(value) => setValue("subject", value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="order">Order Inquiry</SelectItem>
                                    <SelectItem value="product">Product Question</SelectItem>
                                    <SelectItem value="trial">Try Before You Buy</SelectItem>
                                    <SelectItem value="return">Returns & Exchanges</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors.subject && (
                                  <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>
                                )}
                              </div>

                              <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  {...register("message")}
                                  placeholder="How can we help?"
                                  className="mt-1 min-h-32"
                                />
                                {errors.message && (
                                  <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                                )}
                              </div>

                              <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                              </Button>
                            </form>
                        </div>

                        {/* Contact Options & Info */}
                        <div className="space-y-6">
                            {/* Quick Contact Cards */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                <a
                                    href="https://wa.me/966579395835"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group border border-neutral-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
                                            <MessageCircle className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">WhatsApp</h3>
                                            <p className="text-sm text-neutral-600">Quickest response</p>
                                        </div>
                                    </div>
                                </a>

                                <a
                                    href="https://www.instagram.com/oikoksa/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group border border-neutral-200 rounded-xl p-6 hover:border-pink-500 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition">
                                            <Instagram className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Instagram</h3>
                                            <p className="text-sm text-neutral-600">Send us a DM</p>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 space-y-4">
                                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-neutral-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm text-neutral-600">support@oiko.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-neutral-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Location</p>
                                            <p className="text-sm text-neutral-600">Riyadh, Saudi Arabia</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-neutral-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Business Hours</p>
                                            <p className="text-sm text-neutral-600">Monday - Friday: 9 AM - 6 PM</p>
                                            <p className="text-sm text-neutral-600">Response time: Within 24 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Old contact cards retained for reference */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto hidden">
                        {/* WhatsApp Card */}
                        <a
                            href="https://wa.me/966579395835"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <div className="border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg h-full flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                    <MessageCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">WhatsApp</h2>
                                <p className="text-muted-foreground mb-4">
                                    Chat with us directly for quick responses
                                </p>
                                <Button className="mt-auto bg-green-500 hover:bg-green-600">
                                    Start Chat
                                </Button>
                            </div>
                        </a>

                        {/* Instagram Card */}
                        <a
                            href="https://www.instagram.com/oikoksa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                        >
                            <div className="border border-border rounded-2xl p-8 hover:border-primary transition-all duration-300 hover:shadow-lg h-full flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                                    <Instagram className="w-8 h-8 text-pink-500" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">Instagram</h2>
                                <p className="text-muted-foreground mb-4">
                                    Follow us and send a DM for support
                                </p>
                                <Button className="mt-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                    Visit Profile
                                </Button>
                            </div>
                        </a>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 p-6 bg-muted/50 rounded-xl">
                        <h3 className="font-semibold mb-2">Business Hours</h3>
                        <p className="text-muted-foreground text-sm">
                            We typically respond within 24 hours during business days (Monday - Friday, 9 AM - 6 PM)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
