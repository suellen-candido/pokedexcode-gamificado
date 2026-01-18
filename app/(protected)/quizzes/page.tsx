"use client";

import { BookOpen, Trophy, Star, Zap, Award, Clock, FileText, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthState, useAuthActions } from "@/lib/client/contexts/auth-context";
import { useClassStore } from "@/lib/client/store/class-store";

import { LoadingScreen } from "@/lib/client/components/loading-screen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/lib/client/components/ui/card";
import { AuthenticatedLayout } from "@/lib/client/components/layout/AuthenticatedLayout";
import { Header } from "@/lib/client/components/great-hall/header";
import { Button } from "@/lib/client/components/ui/button";
import { Badge } from "@/lib/client/components/ui/badge";
import { Progress } from "@/lib/client/components/ui/progress";

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

function QuizzesPageContent() {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { classInfo } = useClassStore();
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  if (!user || !classInfo) {
    return <LoadingScreen message="Aguardando dados..." />;
  }

  // Quizzes de exemplo - você pode substituir por dados reais
  const quizzes = [
    {
      id: 1,
      title: "Fundamentos de Python",
      description: "Aprenda os conceitos básicos de programação Python",
      difficulty: "Iniciante",
      questions: 10,
      xpReward: 100,
      timeEstimate: "15 min",
      completed: false,
      icon: "🐍",
    },
    {
      id: 2,
      title: "Estruturas de Dados",
      description: "Domine listas, dicionários e tuplas",
      difficulty: "Intermediário",
      questions: 15,
      xpReward: 200,
      timeEstimate: "20 min",
      completed: false,
      icon: "📊",
    },
    {
      id: 3,
      title: "Funções e Módulos",
      description: "Aprenda a criar e usar funções em Python",
      difficulty: "Intermediário",
      questions: 12,
      xpReward: 150,
      timeEstimate: "18 min",
      completed: false,
      icon: "⚙️",
    },
    {
      id: 4,
      title: "Programação Orientada a Objetos",
      description: "Classes, objetos e herança em Python",
      difficulty: "Avançado",
      questions: 20,
      xpReward: 300,
      timeEstimate: "30 min",
      completed: false,
      icon: "🎯",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "Intermediário":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "Avançado":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Header
        title="Aprender Python"
        subtitle="Complete quizzes e ganhe pontos de experiência"
        icon={BookOpen}
        showBackButton={true}
        backButtonHref="/great-hall"
        showCurrency="galleons"
        user={user}
        classInfo={classInfo}
        onLogout={logout}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes Disponíveis</p>
                  <p className="text-2xl font-bold">{quizzes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">XP Total Disponível</p>
                  <p className="text-2xl font-bold">{quizzes.reduce((acc, q) => acc + q.xpReward, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Como Funciona</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-1">🎯 Complete Quizzes</p>
                    <p>Responda questões sobre Python e teste seus conhecimentos</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">⭐ Ganhe XP</p>
                    <p>Cada quiz completado rende pontos de experiência</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">🏆 Suba de Nível</p>
                    <p>Acumule XP para aumentar seu nível e desbloquear recompensas</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materiais de Estudo */}
        {materials.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Materiais de Estudo Disponíveis
              </CardTitle>
              <CardDescription>
                Materiais complementares enviados pelo professor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 truncate">
                            {material.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {material.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            Enviado em {new Date(material.uploadedAt).toLocaleDateString('pt-BR')}
                          </p>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(material.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Acessar Material
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{quiz.icon}</div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {quiz.description}
                      </CardDescription>
                    </div>
                  </div>
                  {quiz.completed && (
                    <Badge className="bg-green-500">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-primary/30">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {quiz.questions} questões
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/30">
                    <Star className="w-3 h-3 mr-1" />
                    {quiz.xpReward} XP
                  </Badge>
                  <Badge variant="outline" className="border-blue-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {quiz.timeEstimate}
                  </Badge>
                </div>

                {quiz.completed && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span className="font-semibold">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                )}

                <Button 
                  className="w-full group-hover:shadow-lg transition-all"
                  disabled={quiz.completed}
                >
                  {quiz.completed ? (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Revisar Quiz
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Começar Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="mt-8 border-dashed">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mais Quizzes em Breve</h3>
            <p className="text-muted-foreground">
              Novos quizzes e desafios serão adicionados regularmente. Continue praticando!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function QuizzesPageWithLayout() {
  return (
    <AuthenticatedLayout>
      <QuizzesPageContent />
    </AuthenticatedLayout>
  );
}
