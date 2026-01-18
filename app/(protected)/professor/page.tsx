"use client";

import { BookOpen, Users, Trophy, TrendingUp, ShieldAlert, Upload, FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthState, useAuthActions } from "@/lib/client/contexts/auth-context";
import { useClassStore } from "@/lib/client/store/class-store";

import { LoadingScreen } from "@/lib/client/components/loading-screen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/client/components/ui/card";
import { AuthenticatedLayout } from "@/lib/client/components/layout/AuthenticatedLayout";
import { Header } from "@/lib/client/components/great-hall/header";
import { Button } from "@/lib/client/components/ui/button";
import { Input } from "@/lib/client/components/ui/input";
import { Label } from "@/lib/client/components/ui/label";
import { Badge } from "@/lib/client/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/lib/client/components/ui/alert-dialog";

interface Material {
  id: string;
  name: string;
  url: string;
  type: string;
  originalName?: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: number;
}

function ProfessorPageContent() {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { classInfo } = useClassStore();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialName, setMaterialName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário tem email @ufc.br ou é o email autorizado
    const isAuthorized = user && (user.email.endsWith('@ufc.br') || user.email === 'suulpessoal@gmail.com');
    if (user && !isAuthorized) {
      router.push('/great-hall');
    }
    
    // Carregar materiais
    if (user && isAuthorized) {
      fetchMaterials();
    }
  }, [user, router]);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleUploadMaterial = async () => {
    if (!materialName || !selectedFile || !user) {
      toast.error('Campos obrigatórios', {
        description: 'Por favor, preencha todos os campos e selecione um arquivo'
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', materialName);
      formData.append('uploadedBy', user.email);

      const response = await fetch('/api/materials', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMaterialName("");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('material-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchMaterials();
        toast.success('Material enviado!', {
          description: 'O material foi enviado com sucesso e está disponível para os alunos'
        });
      } else {
        toast.error('Erro ao enviar', {
          description: 'Não foi possível enviar o material. Tente novamente.'
        });
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error('Erro ao enviar', {
        description: 'Ocorreu um erro ao enviar o material'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      const response = await fetch(`/api/materials?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchMaterials();
        toast.success('Material removido!', {
          description: 'O material foi removido com sucesso'
        });
      } else {
        toast.error('Erro ao remover', {
          description: 'Não foi possível remover o material'
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Erro ao remover', {
        description: 'Ocorreu um erro ao remover o material'
      });
    } finally {
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setMaterialToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (!user || !classInfo) {
    return <LoadingScreen message="Aguardando dados..." />;
  }

  // Verificação adicional de acesso
  const isAuthorized = user.email.endsWith('@ufc.br') || user.email === 'suulpessoal@gmail.com';
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ShieldAlert className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-center">Acesso Restrito</CardTitle>
            <CardDescription className="text-center">
              Esta área é exclusiva para professores com email institucional @ufc.br
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Apenas professores com email institucional podem acessar o painel do professor.
            </p>
            <Button onClick={() => router.push('/great-hall')} className="w-full">
              Voltar para o Great Hall
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Header
        title="Painel do Professor"
        subtitle="Gerencie seus alunos e atividades"
        icon={BookOpen}
        showBackButton={true}
        backButtonHref="/great-hall"
        showCurrency="galleons"
        user={user}
        classInfo={classInfo}
        onLogout={logout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Estudantes registrados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atividades</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Quizzes disponíveis</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conclusões</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Atividades completadas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Performance média</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload de Material */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Enviar Material de Estudo
              </CardTitle>
              <CardDescription>
                Adicione links para PDFs, apresentações ou outros materiais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="material-name">Nome do Material</Label>
                <Input
                  id="material-name"
                  placeholder="Ex: Introdução ao Python"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-file">Arquivo</Label>
                <Input
                  id="material-file"
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.zip"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <Button 
                onClick={handleUploadMaterial} 
                className="w-full"
                disabled={isLoading || !selectedFile}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isLoading ? 'Enviando...' : 'Enviar Material'}
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Materiais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Materiais Cadastrados ({materials.length})
              </CardTitle>
              <CardDescription>
                Materiais disponíveis para os alunos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {materials.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum material cadastrado ainda</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-sm">{material.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {material.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {material.originalName && `Arquivo: ${material.originalName}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enviado em {new Date(material.uploadedAt).toLocaleDateString('pt-BR')}
                          {material.size && ` • ${(material.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(material.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Painel do Professor</CardTitle>
            <CardDescription>
              Gerencie suas turmas, atividades e acompanhe o progresso dos alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Recursos Adicionais em Desenvolvimento</h3>
              <p className="text-muted-foreground mb-6">
                Mais funcionalidades do painel do professor estarão disponíveis em breve.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O material será permanentemente removido do sistema e os alunos não terão mais acesso a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (materialToDelete) {
                  handleDeleteMaterial(materialToDelete);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, remover material
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ProfessorPageWithLayout() {
  return (
    <AuthenticatedLayout>
      <ProfessorPageContent />
    </AuthenticatedLayout>
  );
}
