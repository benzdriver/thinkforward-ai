declare module '@clerk/clerk-react' {
  interface LoadedClerk {
    isLoaded: boolean;
    user?: {
      id: string;
    };
    session?: {
      getToken: () => Promise<string>;
    };
    client: {
      signIn: {
        create: (params: { identifier: string; password: string }) => Promise<any>;
      };
    };
    signOut: () => Promise<void>;
  }
} 