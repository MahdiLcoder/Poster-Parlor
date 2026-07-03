"use client";

import { useState, useEffect } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { INDIAN_STATES, type IndianState } from "@/lib/constants/pricing";
import { useGetCurrentUserQuery } from "@/store/api/auth.api";
import {
  User,
  MapPin,
  Wallet,
  CreditCard,
  Banknote,
  CheckCircle2,
} from "lucide-react";

export interface CheckoutFormData {
  // Customer Info
  name: string;
  email: string;
  phone: string;
  // Shipping Address
  addressLine1: string;
  city: string;
  state: IndianState | "";
  pincode: string;
  // Payment
  paymentMethod: "ONLINE" | "COD";
  // Notes
  notes: string;
}

interface CheckoutFormProps {
  onFormChange: (data: CheckoutFormData, isValid: boolean) => void;
  onStateChange: (state: string) => void;
}

const initialFormData: CheckoutFormData = {
  name: "",
  email: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "ONLINE",
  notes: "",
};

export function CheckoutForm({
  onFormChange,
  onStateChange,
}: CheckoutFormProps) {
  const { data: userData } = useGetCurrentUserQuery(undefined);
  const user = userData?.data as { name: string; email: string } | undefined;

  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CheckoutFormData, boolean>>
  >({});

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Notify parent of state changes
  useEffect(() => {
    if (formData.state) {
      onStateChange(formData.state);
    }
  }, [formData.state, onStateChange]);

  // Validate and notify parent
  useEffect(() => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onFormChange(formData, isValid);
  }, [formData, onFormChange]);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof CheckoutFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showError = (field: keyof CheckoutFormData) =>
    touched[field] && errors[field];

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </div>
          <CardDescription>
            Provide your contact details for order updates
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="checkout-name">Full Name *</FieldLabel>
              <Input
                id="checkout-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                aria-invalid={showError("name") ? true : undefined}
              />
              {showError("name") && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.name}
                </FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={showError("email") ? true : undefined}
                />
                {showError("email") && (
                  <FieldDescription className="text-destructive text-xs">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="checkout-phone">Phone Number *</FieldLabel>
                <Input
                  id="checkout-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  aria-invalid={showError("phone") ? true : undefined}
                />
                {showError("phone") && (
                  <FieldDescription className="text-destructive text-xs">
                    {errors.phone}
                  </FieldDescription>
                )}
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Shipping Address</CardTitle>
          </div>
          <CardDescription>
            Where should we deliver your posters?
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="checkout-address">Address Line *</FieldLabel>
              <Input
                id="checkout-address"
                placeholder="123 Main Street, Apartment 4B"
                value={formData.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                onBlur={() => handleBlur("addressLine1")}
                aria-invalid={showError("addressLine1") ? true : undefined}
              />
              {showError("addressLine1") && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.addressLine1}
                </FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="checkout-city">City *</FieldLabel>
                <Input
                  id="checkout-city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  aria-invalid={showError("city") ? true : undefined}
                />
                {showError("city") && (
                  <FieldDescription className="text-destructive text-xs">
                    {errors.city}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="checkout-pincode">Pincode *</FieldLabel>
                <Input
                  id="checkout-pincode"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  onBlur={() => handleBlur("pincode")}
                  maxLength={6}
                  aria-invalid={showError("pincode") ? true : undefined}
                />
                {showError("pincode") && (
                  <FieldDescription className="text-destructive text-xs">
                    {errors.pincode}
                  </FieldDescription>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="checkout-state">State *</FieldLabel>
              <Select
                value={formData.state}
                onValueChange={(value) => handleChange("state", value)}
              >
                <SelectTrigger
                  id="checkout-state"
                  className="w-full"
                  aria-invalid={showError("state") ? true : undefined}
                >
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showError("state") && (
                <FieldDescription className="text-destructive text-xs">
                  {errors.state}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </div>
          <CardDescription>
            Choose how you&apos;d like to pay for your order
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Online Payment Option */}
            <button
              type="button"
              onClick={() => handleChange("paymentMethod", "ONLINE")}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                formData.paymentMethod === "ONLINE"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-muted hover:border-muted-foreground/30 hover:bg-muted/30"
              }`}
            >
              {formData.paymentMethod === "ONLINE" && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}
              <div
                className={`p-3 rounded-full ${
                  formData.paymentMethod === "ONLINE"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">Pay Online</p>
                <p className="text-sm text-muted-foreground">
                  Card, UPI, Net Banking
                </p>
              </div>
            </button>

            {/* COD Option */}
            <button
              type="button"
              onClick={() => handleChange("paymentMethod", "COD")}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                formData.paymentMethod === "COD"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-muted hover:border-muted-foreground/30 hover:bg-muted/30"
              }`}
            >
              {formData.paymentMethod === "COD" && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}
              <div
                className={`p-3 rounded-full ${
                  formData.paymentMethod === "COD"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <Banknote className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">
                  Pay when you receive
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
          <CardDescription>
            Any special instructions for your order? (Optional)
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Field>
            <textarea
              id="checkout-notes"
              placeholder="E.g., Please leave at the door, call before delivery..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
