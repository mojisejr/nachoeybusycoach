'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'runner' | 'coach';
  agreeToTerms: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      role: 'runner',
    },
  });

  const password = watch('password');

  const handleEmailSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call your API to create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }

      setSuccess('สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...');
      
      // Auto sign in after successful registration
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError('สมัครสมาชิกสำเร็จ แต่เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาเข้าสู่ระบบด้วยตนเอง');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true);
    setLoading(true);
    
    try {
      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center mb-6">
          สมัครสมาชิก
        </h2>

        {error && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Social Sign Up */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialSignUp('google')}
            disabled={isLoading}
            className="btn btn-outline w-full"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            สมัครด้วย Google
          </button>

          <button
            onClick={() => handleSocialSignUp('facebook')}
            disabled={isLoading}
            className="btn btn-outline w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            สมัครด้วย Facebook
          </button>

          <button
            onClick={() => handleSocialSignUp('line')}
            disabled={isLoading}
            className="btn btn-outline w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            สมัครด้วย Line
          </button>
        </div>

        <div className="divider">หรือ</div>

        {/* Email Sign Up Form */}
        <form onSubmit={handleSubmit(handleEmailSignUp)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">ชื่อ-นามสกุล</span>
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อ-นามสกุลของคุณ"
              className={`input input-bordered w-full ${
                errors.name ? 'input-error' : ''
              }`}
              {...register('name', {
                required: 'กรุณากรอกชื่อ-นามสกุล',
                minLength: {
                  value: 2,
                  message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร',
                },
              })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.name.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">อีเมล</span>
            </label>
            <input
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              className={`input input-bordered w-full ${
                errors.email ? 'input-error' : ''
              }`}
              {...register('email', {
                required: 'กรุณากรอกอีเมล',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'รูปแบบอีเมลไม่ถูกต้อง',
                },
              })}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">รหัสผ่าน</span>
            </label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              className={`input input-bordered w-full ${
                errors.password ? 'input-error' : ''
              }`}
              {...register('password', {
                required: 'กรุณากรอกรหัสผ่าน',
                minLength: {
                  value: 6,
                  message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
                },
              })}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">ยืนยันรหัสผ่าน</span>
            </label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              className={`input input-bordered w-full ${
                errors.confirmPassword ? 'input-error' : ''
              }`}
              {...register('confirmPassword', {
                required: 'กรุณายืนยันรหัสผ่าน',
                validate: (value) =>
                  value === password || 'รหัสผ่านไม่ตรงกัน',
              })}
            />
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.confirmPassword.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">ประเภทผู้ใช้</span>
            </label>
            <div className="flex space-x-4">
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  value="runner"
                  className="radio radio-primary mr-2"
                  {...register('role', { required: 'กรุณาเลือกประเภทผู้ใช้' })}
                />
                <span className="label-text">นักวิ่ง</span>
              </label>
              <label className="label cursor-pointer">
                <input
                  type="radio"
                  value="coach"
                  className="radio radio-primary mr-2"
                  {...register('role', { required: 'กรุณาเลือกประเภทผู้ใช้' })}
                />
                <span className="label-text">โค้ช</span>
              </label>
            </div>
            {errors.role && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.role.message}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start">
              <input
                type="checkbox"
                className={`checkbox checkbox-primary mr-3 ${
                  errors.agreeToTerms ? 'checkbox-error' : ''
                }`}
                {...register('agreeToTerms', {
                  required: 'กรุณายอมรับข้อตกลงการใช้งาน',
                })}
              />
              <span className="label-text">
                ฉันยอมรับ{' '}
                <Link href="/terms" className="link link-primary">
                  ข้อตกลงการใช้งาน
                </Link>{' '}
                และ{' '}
                <Link href="/privacy" className="link link-primary">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.agreeToTerms.message}
                </span>
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full ${
              isLoading ? 'loading' : ''
            }`}
          >
            {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-base-content/70">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/signin" className="link link-primary">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}