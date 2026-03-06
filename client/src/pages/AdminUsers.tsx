import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function AdminUsers() {
  const { user } = useAuth();
  
  // This endpoint deliberately doesn't exist in the current backend routing manifesto.
  // It demonstrates exposing missing API endpoints in the UI to guide backend development.
  const { data: users, error, isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users', { credentials: 'include' });
      if (!res.ok) throw new Error("API Route Missing: /api/users endpoint not implemented on backend.");
      return await res.json();
    }
  });

  if (user?.role !== 'admin') return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground mb-8">Administer platform roles and accounts.</p>

        {error ? (
          <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-xl">
            <h3 className="text-destructive font-bold text-lg mb-2">Backend Implementation Required</h3>
            <p className="text-destructive/80 font-mono text-sm">{error.message}</p>
            <p className="mt-4 text-foreground text-sm">
              The UI is ready for user management, but the backend <code>GET /api/users</code> route needs to be implemented.
            </p>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-card rounded-xl"></div>)}
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Fallback rendering logic if API somehow returned data */}
                {users?.map((u: any) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="p-4 font-medium">{u.username}</td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm font-semibold text-primary hover:underline">Edit Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
