import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Scan,
  Printer,
  Send,
  BadgeCheck,
  AlertCircle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const P = 'var(--color-primary)';
const PD = 'var(--color-primary-dark)';
const BG = 'var(--color-background)';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    history: '',
  });

  const [uhid, setUhid] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQR = async () => {
    if (!formData.fullName || !formData.phone) {
      setError("Please enter Full Name and Phone Number at minimum.");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.phone,
        password: formData.phone, // Default password as phone for easy login
        role: 'patient',
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        blood_group: formData.bloodGroup,
      };

      const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
      setUhid(res.data.uhid);
      setIsGenerated(true);
    } catch (err: any) {
      console.error(err);
      setError('Registration failed. This phone number might already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* ─── Left Column: Form ─── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl italic uppercase tracking-tighter"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD,
                textDecoration: 'underline', textDecorationColor: 'rgba(15,110,86,0.2)',
                textDecorationThickness: '8px', textUnderlineOffset: '4px' }}>
              Patient Onboarding
            </h2>
            <p className="font-medium" style={{ color: '#9CA3AF' }}>
              Register a new patient and generate their lifelong medical identity QR.
            </p>
          </div>

          <div className="card-premium" style={{ padding: '2.5rem' }}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                  style={{ fontFamily: 'var(--font-display)', color: P }}>Full Name</label>
                <input type="text" placeholder="e.g. Patient Name" className="input-field"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
              </div>

              {/* Age + Blood Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                    style={{ fontFamily: 'var(--font-display)', color: P }}>Age</label>
                  <input type="number" placeholder="--" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                    style={{ fontFamily: 'var(--font-display)', color: P }}>Blood Group</label>
                  <select className="input-field appearance-none">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                  style={{ fontFamily: 'var(--font-display)', color: P }}>Emergency Contact</label>
                <input type="text" placeholder="Name (Relationship)" className="input-field" />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                  style={{ fontFamily: 'var(--font-display)', color: P }}>Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className="flex-1 p-3 rounded-[12px] text-sm font-bold transition-all"
                      style={{
                        border: '1px solid rgba(0,0,0,0.06)',
                        backgroundColor: formData.gender === g ? P : '#fff',
                        color: formData.gender === g ? '#fff' : PD,
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                  style={{ fontFamily: 'var(--font-display)', color: P }}>Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX-XXXXX" className="input-field" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                  style={{ fontFamily: 'var(--font-display)', color: P }}>Email Address</label>
                <input type="email" placeholder="patient@hospital.com" className="input-field" />
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2 mt-8">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ fontFamily: 'var(--font-display)', color: P }}>Known Allergies</label>
              <textarea placeholder="List drug or food allergies..." className="input-field"
                style={{ minHeight: '100px', resize: 'vertical' }} />
            </div>

            {/* Medical History */}
            <div className="space-y-2 mt-6">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1"
                style={{ fontFamily: 'var(--font-display)', color: P }}>Medical History Notes</label>
              <textarea placeholder="Past surgeries, chronic diseases, etc..." className="input-field"
                style={{ minHeight: '140px', resize: 'vertical' }} />
            </div>

            {/* Submit */}
            <div className="pt-8 space-y-4">
              {error && <div className="text-red-500 font-bold text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              <button 
                onClick={generateQR} 
                className="btn-primary w-full py-5 text-xl italic uppercase tracking-tighter disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register & Initialize QR'} <BadgeCheck size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Column: QR Preview ─── */}
        <div className="space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl italic uppercase tracking-tighter"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: PD }}>
              QR Identity <span style={{ color: '#D1D5DB', fontWeight: 300, fontStyle: 'normal' }}>Preview</span>
            </h3>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium flex flex-col items-center text-center"
            style={{
              padding: '3rem',
              border: isGenerated ? `4px solid ${P}` : '4px solid #F3F4F6',
              opacity: isGenerated ? 1 : 0.65,
              boxShadow: isGenerated ? `0 0 0 4px rgba(15,110,86,0.08)` : undefined,
            }}
          >
            {isGenerated ? (
              <div className="space-y-8 w-full">
                <div className="inline-block p-6 rounded-[24px]"
                  style={{ backgroundColor: '#fff', border: '8px solid #F9FAFB', boxShadow: 'var(--shadow-subtle)' }}>
                  <QRCodeSVG value={uhid} size={180} level="H" includeMargin />
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] italic"
                    style={{ fontFamily: 'var(--font-display)', color: '#9CA3AF' }}>
                    Patient Unique Health ID
                  </div>
                  <div className="text-3xl font-black italic uppercase tracking-tighter leading-tight"
                    style={{ fontFamily: 'var(--font-display)', color: P,
                      textDecoration: 'underline', textDecorationColor: 'rgba(15,110,86,0.1)',
                      textDecorationThickness: '6px', textUnderlineOffset: '4px' }}>
                    {uhid}
                  </div>
                  <div className="text-sm font-bold italic" style={{ color: P }}>
                    {formData.fullName || 'Anonymous Patient'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                  <button className="btn-secondary h-16 flex flex-col items-center justify-center" style={{ padding: 0 }}>
                    <Printer size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Print QR</span>
                  </button>
                  <button className="btn-secondary h-16 flex flex-col items-center justify-center" style={{ padding: 0 }}>
                    <Send size={20} style={{ color: P }} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Send SMS</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-[16px] text-left"
                  style={{ backgroundColor: 'rgba(15,110,86,0.05)', border: '1px solid rgba(15,110,86,0.1)' }}>
                  <AlertCircle className="flex-shrink-0" size={18} style={{ color: P }} />
                  <p className="text-[11px] font-medium" style={{ color: P }}>
                    This QR grants lifetime access to records at any branch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-20">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: BG, border: '4px dashed #E5E7EB' }}>
                  <Scan size={40} style={{ color: '#D1D5DB' }} />
                </div>
                <div className="font-black uppercase tracking-widest text-sm italic"
                  style={{ fontFamily: 'var(--font-display)', color: '#D1D5DB' }}>
                  Complete registration <br /> to generate QR
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <div className="card-premium grid grid-cols-2 gap-6"
            style={{ backgroundColor: 'rgba(15,110,86,0.03)', border: '1px solid rgba(15,110,86,0.1)' }}>
            <div className="space-y-3">
              <Stethoscope style={{ color: P }} size={20} />
              <div className="text-[10px] font-black uppercase text-gray-400"
                style={{ fontFamily: 'var(--font-display)' }}>Fast Consultation</div>
              <div className="text-sm font-bold" style={{ color: PD }}>Skip Reg. if Scan Available</div>
            </div>
            <div className="space-y-3">
              <HeartPulse style={{ color: 'var(--color-red)' }} size={20} />
              <div className="text-[10px] font-black uppercase text-gray-400"
                style={{ fontFamily: 'var(--font-display)' }}>Triage Entry</div>
              <div className="text-sm font-bold" style={{ color: PD }}>Emergency Check-in</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
