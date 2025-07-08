// app/join/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiUserAddLine,
  RiShieldCheckLine,
  RiErrorWarningLine,
  RiCheckLine,
} from 'react-icons/ri';

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: '+1',
    phone: '',
    email: '',
    password: '',
    agreeTerms: false,
    agreePrivacy: false,
    optInMarketing: false
  });

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate password requirements
    const isPasswordValid = Object.values(passwordStrength).every(Boolean);
    if (!isPasswordValid) {
      setError('Por favor, asegúrate de cumplir todos los requisitos de la contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría tu lógica de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/verificacion-email');
    } catch (err) {
      setError('Ocurrió un error al crear tu cuenta. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-100 rounded-full">
              <RiUserAddLine className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              href="/login" 
              className="font-medium text-amber-600 hover:text-amber-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border border-amber-100/50">
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiUserLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                      placeholder="Juan"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiUserLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                      placeholder="Pérez"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-24 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                  >
                    <option value="+1">+1</option>
                    <option value="+52">+52</option>
                    <option value="+34">+34</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiPhoneLine className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                      placeholder="123-456-7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiMailLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                    placeholder="tu@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      checkPasswordStrength(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <RiEyeLine className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2 space-y-2 text-sm">
                  <p className="font-medium text-gray-700">La contraseña debe tener:</p>
                  <ul className="space-y-1 text-gray-500">
                    {Object.entries({
                      'Mínimo 8 caracteres': passwordStrength.hasMinLength,
                      'Al menos una mayúscula': passwordStrength.hasUpperCase,
                      'Al menos una minúscula': passwordStrength.hasLowerCase,
                      'Al menos un número': passwordStrength.hasNumber,
                      'Al menos un carácter especial (!@#$%^&*)': passwordStrength.hasSpecialChar
                    }).map(([requirement, isMet]) => (
                      <li key={requirement} className="flex items-center">
                        {isMet ? (
                          <RiCheckLine className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <RiErrorWarningLine className="h-4 w-4 text-gray-300 mr-2" />
                        )}
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      Acepto los{' '}
                      <Link href="/terminos" className="text-amber-600 hover:text-amber-500">
                        Términos y Condiciones
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="privacy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="privacy" className="font-medium text-gray-700">
                      Acepto la{' '}
                      <Link href="/privacidad" className="text-amber-600 hover:text-amber-500">
                        Política de Privacidad
                      </Link>
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketing"
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      checked={formData.optInMarketing}
                      onChange={(e) => setFormData({ ...formData, optInMarketing: e.target.checked })}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketing" className="text-gray-700">
                      Me gustaría recibir ofertas exclusivas, noticias y actualizaciones de marketing
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex">
                    <RiErrorWarningLine className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  'Registrarme'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <RiShieldCheckLine className="h-5 w-5 text-gray-400 mr-2" />
          <p>Tus datos están seguros y protegidos</p>
        </div>
      </div>
    </div>
  );
}                           