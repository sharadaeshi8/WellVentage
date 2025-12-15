"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, gymService } from "@/lib/services";
import BrandLogo from "@/components/BrandLogo";

export default function RegisterDetails() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    ownerFirstName: "",
    ownerLastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    phoneCountryCode: "+91",
    phoneNumber: "",
  });
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const onOtpChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && refs.current[idx + 1]) refs.current[idx + 1]?.focus();
  };

  const onOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[idx] && refs.current[idx - 1]) {
      refs.current[idx - 1]?.focus();
    }
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const resolveCountry = (cc: string) => {
    if (cc.startsWith("+91")) return "IN";
    if (cc.startsWith("+1")) return "US";
    if (cc.startsWith("+44")) return "GB";
    return undefined;
  };

  const sendCode = async () => {
    if (sending) return;
    try {
      setMessage("");
      setSending(true);
      const phone = `${form.phoneCountryCode} ${form.phoneNumber}`.trim();
      if (!form.phoneNumber || form.phoneNumber.trim().length < 4) {
        setMessage("Please enter a valid phone number");
        return;
      }
      await authService.sendVerificationCode(
        phone,
        resolveCountry(form.phoneCountryCode)
      );
      setMessage("Verification code sent");
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (verifying) return;
    try {
      setMessage("");
      setVerifying(true);
      const code = otp.join("");
      const phone = `${form.phoneCountryCode} ${form.phoneNumber}`.trim();
      const data = await authService.verifyCode(
        phone,
        code,
        resolveCountry(form.phoneCountryCode)
      );
      if (data?.ok) {
        setVerified(true);
        setMessage("Phone verified successfully!");
        return true;
      } else {
        setVerified(false);
        setMessage("Invalid verification code");
        return false;
      }
    } catch (e: any) {
      setVerified(false);
      setMessage(e?.response?.data?.message || "Verification failed");
      return false;
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      // Check if OTP is entered but not verified yet
      const otpCode = otp.join("");
      if (otpCode.length >= 4 && !verified) {
        setMessage("Verifying phone number...");
        const isVerified = await verifyCode();
        if (!isVerified) {
          setSubmitting(false);
          return; // Stop submission if verification fails
        }
      }

      // Check if phone verification is required but not done
      if (!verified) {
        setMessage("Please verify your phone number before continuing");
        setSubmitting(false);
        return;
      }

      // Proceed with form submission
      setMessage("Saving your details...");
      const payload = {
        name: form.name,
        ownerFirstName: form.ownerFirstName,
        ownerLastName: form.ownerLastName,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        country: form.country,
        phone: `${form.phoneCountryCode} ${form.phoneNumber}`.trim(),
        phoneVerified: verified,
      };
      await gymService.createGym(payload);
      router.push("/leads");
    } catch (err) {
      console.error("Failed to create gym", err);
      alert("Failed to save details. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:grid grid-cols-2 overflow-auto lg:overflow-visible">
      <div className="p-8 bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
        <div className="flex flex-col items-center gap-3.5">
          <BrandLogo
            size={"100%"}
            className="w-auto lg:w-[278px] h-[100px] lg:h-[248px]"
          />
          <div className="text-2xl lg:text-4xltext-4xl font-semibold text-neutral-700">
            Wellvantage
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-8 bg-gray-50 h-dvh flex items-start justify-center py-16 overflow-visible lg:overflow-auto">
        <form
          onSubmit={onSubmit}
          className="w-[560px] max-w-full space-y-6 bg-white"
        >
          <div className="flex flex-col gap-10">
            <h2 className="text-2xl font-semibold text-center text-neutral-700">
              Details
            </h2>
            <p className="text-lg text-neutral-700 font-semibold text-left">
              Let’s build your gym’s digital HQ! 🏋️‍♂️
            </p>
            <p className="text-base text-[#737373] font-semibold text-left">
              Enter your name, address & contact so we can tailor everything for
              your business.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Gym Name<span>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium flex flex-col">
                <span>
                  Gym Owner’s First Name<span>*</span>{" "}
                </span>
                <span>(will have access to all features of the app)</span>
              </label>
              <input
                name="ownerFirstName"
                value={form.ownerFirstName}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Last Name<span>*</span>
              </label>
              <input
                name="ownerLastName"
                value={form.ownerLastName}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Address Line 1<span>*</span>
              </label>
              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Address Line 2
              </label>
              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                City<span>*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                State<span>*</span>
              </label>
              <input
                name="state"
                value={form.state}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Country<span>*</span>
              </label>
              <input
                name="country"
                value={form.country}
                onChange={onChange}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[8px] shadow-[0px_0px_2px_2px_#D9D9D9]"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-lg text-[#737373] font-medium">
                Phone Number
              </label>
              <div className="flex items-center gap-10">
                <div className="flex shadow-[0px_0px_2px_2px_#D9D9D9] rounded-xl overflow-hidden flex-1">
                  <select
                    name="phoneCountryCode"
                    value={form.phoneCountryCode}
                    onChange={onChange}
                    className="h-10 px-2  w-[65px] text-[#737373] bg-[#D9D9D9] "
                  >
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
                  </select>
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={onChange}
                    className="w-full h-10 px-3 border border-[#D9D9D9] shadow-[0px_0px_2px_2px_#D9D9D9] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={sending}
                  aria-disabled={sending}
                  className="relative z-20 pointer-events-auto px-4 py-3 bg-green-500 text-white rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {sending ? "Sending..." : "Verify"}
                </button>
              </div>
            </div>
            {/* OTP boxes */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    className="w-12 h-12 text-center rounded-xl focus:border-green-500 focus:outline-none shadow-[0px_0px_2px_2px_#D9D9D9]"
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
              {message && (
                <div
                  className={`text-sm ${
                    verified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm justify-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-base text-neutral-700">
              I agree to the{" "}
              <a href="#" className="text-[#1D7885] underline font-semibold">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!agreed || submitting}
              className="w-full max-w-[393px] h-11 bg-[#28A745] text-white rounded-xl disabled:opacity-50 font-bold "
            >
              {submitting ? "Saving..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
