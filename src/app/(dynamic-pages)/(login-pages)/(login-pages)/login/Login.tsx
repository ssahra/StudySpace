'use client';
import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RedirectingPleaseWaitCard } from '@/components/Auth/RedirectingPleaseWaitCard';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  signInWithMagicLinkAction,
  signInWithPasswordAction,
  signInWithProviderAction,
} from '@/data/auth/auth';
import { createClient } from '@/supabase-clients/client';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function Login({
  next,
  nextActionType,
}: {
  next?: string;
  nextActionType?: string;
}) {
  const [emailSentSuccessMessage, setEmailSentSuccessMessage] = useState<
    string | null
  >(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);

  const router = useRouter();

  async function redirectToDashboard() {
    if (next) {
      router.push(`/auth/callback?next=${next}`);
      return;
    }

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error getting user:', userError);
        router.push('/dashboard');
        return;
      }

      // Get user role from database
      console.log('Checking role for user ID:', user.id);

      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Role query result:', { userData, roleError });

      if (roleError) {
        console.error('Error getting user role:', roleError);
        // Check if user doesn't exist in users table
        if (roleError.code === 'PGRST116') {
          console.log('User not found in users table, creating user record...');
          // Try to create user record with default role
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              username: user.email,
              role: 'student', // Default role
              createdat: new Date().toISOString()
            });

          if (createError) {
            console.error('Error creating user record:', createError);
            router.push('/dashboard');
            return;
          }

          // Now try to get the role again
          const { data: newUserData, error: newRoleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (newRoleError || !newUserData) {
            console.error('Error getting user role after creation:', newRoleError);
            router.push('/dashboard');
            return;
          }

          // Use the new user data
          console.log('User role (new user):', newUserData.role);
          if (newUserData.role === 'admin') {
            router.push('/admin-dashboard');
          } else {
            router.push('/dashboard');
          }
          return;
        } else {
          router.push('/dashboard');
          return;
        }
      }

      if (!userData) {
        console.error('No user data found');
        router.push('/dashboard');
        return;
      }

      // Route based on role
      console.log('User role (existing user):', userData.role);
      if (userData.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        // For student, staff, or any other role
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Error in role-based routing:', error);
      // Fallback to dashboard on any error
      router.push('/dashboard');
    }
  }

  const { execute: executeMagicLink, status: magicLinkStatus } = useAction(
    signInWithMagicLinkAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Sending magic link...');
      },
      onSuccess: () => {
        toast.success('A magic link has been sent to your email!', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        setEmailSentSuccessMessage('A magic link has been sent to your email!');
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Send magic link failed ${String(error)}`;
        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executePassword, status: passwordStatus } = useAction(
    signInWithPasswordAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Logging in...');
      },
      onSuccess: async () => {
        toast.success('Logged in!', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        await redirectToDashboard();
        setRedirectInProgress(true);
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Sign in account failed ${String(error)}`;
        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executeProvider, status: providerStatus } = useAction(
    signInWithProviderAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Requesting login...');
      },
      onSuccess: (payload) => {
        toast.success('Redirecting...', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        window.location.href = payload.data?.url || '/';
      },
      onError: () => {
        toast.error('Failed to login', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  return (
    <div
      data-success={emailSentSuccessMessage}
      className="container data-success:flex items-center data-success:justify-center text-left max-w-lg mx-auto overflow-auto data-success:h-full min-h-[470px]"
    >
      {emailSentSuccessMessage ? (
        <EmailConfirmationPendingCard
          type={'login'}
          heading={'Confirmation Link Sent'}
          message={emailSentSuccessMessage}
          resetSuccessMessage={setEmailSentSuccessMessage}
        />
      ) : redirectInProgress ? (
        <RedirectingPleaseWaitCard
          message="Please wait while we redirect you to your dashboard."
          heading="Redirecting to Dashboard"
        />
      ) : (
        <div className="space-y-8 bg-background p-6 rounded-lg shadow-sm dark:border">
          <Tabs defaultValue="password" className="md:min-w-[400px]">
            {/* <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              <TabsTrigger value="social-login">Social Login</TabsTrigger>
            </TabsList> */}
            <TabsContent value="password">
              <Card className="border-none shadow-none">
                <CardHeader className="py-6 px-0">
                  <CardTitle>Login to StudySpace</CardTitle>
                  <CardDescription>
                    Find available classrooms for studying. Login with your university email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                  <EmailAndPassword
                    isLoading={passwordStatus === 'executing'}
                    onSubmit={(data) => {
                      executePassword({
                        email: data.email,
                        password: data.password,
                      });
                    }}
                    view="sign-in"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="magic-link">
              <Card className="border-none shadow-none">
                <CardHeader className="py-6 px-0">
                  <CardTitle>Login to StudySpace</CardTitle>
                  <CardDescription>
                    Login with magic link we will send to your email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                  <Email
                    onSubmit={(email) => executeMagicLink({ email, next })}
                    isLoading={magicLinkStatus === 'executing'}
                    view="sign-in"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="social-login">
              <Card className="border-none shadow-none">
                <CardHeader className="py-6 px-0">
                  <CardTitle>Login to StudySpace</CardTitle>
                  <CardDescription>
                    Login with your social account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                  <RenderProviders
                    providers={['google', 'github', 'twitter']}
                    isLoading={providerStatus === 'executing'}
                    onProviderLoginRequested={(
                      provider: 'google' | 'github' | 'twitter'
                    ) => executeProvider({ provider, next })}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
