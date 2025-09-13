
'use client';

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserCog } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type UserProfile = {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    role: string;
    created_at: string;
};

type AdminUsersContentProps = {
    initialUsers: UserProfile[];
    initialError: string | null;
}

export default function AdminUsersContent({ initialUsers, initialError }: AdminUsersContentProps) {
    const [users, setUsers] = useState<UserProfile[]>(initialUsers);
    const [loading, setLoading] = useState(false);
    const { supabase } = useAuth();
    const { toast } = useToast();

    // The fetchUsers logic is now primarily for re-fetching after an update
    // The initial load is handled by the server component
    const fetchUsers = async () => {
        if (!supabase) return;
        setLoading(true);
        // This is a client-side call to a serverless function that securely fetches users
        // This pattern is okay but let's stick to SSR for initial load
        // Re-implementing a secure way to refetch if needed. For now, we'll just update state locally.
        
        // This is a placeholder as direct admin calls are not secure on client
        // A proper implementation would use an edge function.
        // For now, we refresh the page to get the new list.
        window.location.reload();
    };

    const makeAdmin = async (userId: string) => {
        if (!supabase) return;
        
        // The API route pattern is more secure for client-side initiated admin actions
        // Let's create and call an API route.
        try {
            const response = await fetch('/api/admin/promote-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to promote user');
            }
            toast({ title: 'Success', description: result.message });
            setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'Could not update user role.' });
        }
    }

    if (initialError) {
        return (
             <Alert variant="destructive">
                <AlertTitle>Error Fetching Users</AlertTitle>
                <AlertDescription>{initialError}</AlertDescription>
            </Alert>
        )
    }

    return (
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    <Loader2 className="mx-auto animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-9">
                                                <AvatarImage src={user.avatar_url} alt={user.full_name} data-ai-hint="person face" />
                                                <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.full_name || 'N/A'}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'vendor' ? 'secondary' : 'outline'}>{user.role}</Badge>
                                    </TableCell>
                                        <TableCell>
                                        {format(new Date(user.created_at), 'PPP')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => makeAdmin(user.id)} disabled={user.role === 'admin'}>
                                                    <UserCog className="mr-2 size-4" />
                                                    Make Admin
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
