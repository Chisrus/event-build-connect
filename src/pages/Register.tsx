import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User, Loader2 } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                console.error("Registration error:", error);
                toast.error(`Échec de l'inscription : ${error.message}`);
            } else if (data?.user && data?.session === null) {
                toast.success("Compte créé ! Veuillez vérifier votre email pour confirmer votre inscription avant de vous connecter.", {
                    duration: 10000,
                });
                navigate("/login");
            } else {
                toast.success("Inscription réussie !");
                navigate("/");
            }
        } catch (error) {
            console.error("Unexpected registration error:", error);
            toast.error("Une erreur inattendue est survenue lors de l'inscription. Vérifiez votre connexion et les clés Supabase.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Rejoignez HM. BUILDING pour louer et partager
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Nom complet</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="pl-9"
                                    placeholder="Jean Dupont"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email-address">Adresse email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="pl-9"
                                    placeholder="exemple@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="pl-9"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            S'inscrire
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
