// Dados mockados para o sistema escolar multi-escola

export const schools = [
  {
    id: 1,
    name: "Colégio São Paulo",
    logo: "🏫",
    address: "Rua das Flores, 123 - São Paulo/SP",
    phone: "(11) 1234-5678",
    email: "contato@colegiosaopaulo.edu.br"
  },
  {
    id: 2,
    name: "Escola Municipal Dom Pedro",
    logo: "🎓",
    address: "Av. Brasil, 456 - Rio de Janeiro/RJ",
    phone: "(21) 9876-5432",
    email: "secretaria@escoladompedro.edu.br"
  },
  {
    id: 3,
    name: "Instituto Educacional Santos",
    logo: "📚",
    address: "Rua da Educação, 789 - Santos/SP",
    phone: "(13) 5555-1234",
    email: "info@institutosantos.edu.br"
  }
];

export const users = [
  // ALUNOS
  {
    id: 1,
    username: "joao.silva",
    password: "123456",
    type: "student",
    schoolId: 1,
    name: "João Silva",
    class: "3º Ano A",
    registration: "2025001",
    parentId: 4,
    birthDate: "2007-03-15",
    email: "joao.silva@email.com"
  },
  {
    id: 2,
    username: "maria.santos",
    password: "123456",
    type: "student",
    schoolId: 1,
    name: "Maria Santos",
    class: "2º Ano B",
    registration: "2025002",
    parentId: 5,
    birthDate: "2008-07-22",
    email: "maria.santos@email.com"
  },
  {
    id: 3,
    username: "pedro.oliveira",
    password: "123456",
    type: "student",
    schoolId: 2,
    name: "Pedro Oliveira",
    class: "1º Ano C",
    registration: "2025003",
    parentId: 6,
    birthDate: "2009-11-08",
    email: "pedro.oliveira@email.com"
  },
  {
    id: 4,
    username: "ana.lima",
    password: "123456",
    type: "student",
    schoolId: 3,
    name: "Ana Lima",
    class: "2º Ano A",
    registration: "2025004",
    parentId: 7,
    birthDate: "2008-01-30",
    email: "ana.lima@email.com"
  },

  // PAIS
  {
    id: 5,
    username: "carlos.silva",
    password: "123456",
    type: "parent",
    schoolId: 1,
    name: "Carlos Silva",
    childrenIds: [1],
    phone: "(11) 99999-1111",
    email: "carlos.silva@email.com"
  },
  {
    id: 6,
    username: "ana.santos",
    password: "123456",
    type: "parent",
    schoolId: 1,
    name: "Ana Santos",
    childrenIds: [2],
    phone: "(11) 99999-2222",
    email: "ana.santos@email.com"
  },
  {
    id: 7,
    username: "jose.oliveira",
    password: "123456",
    type: "parent",
    schoolId: 2,
    name: "José Oliveira",
    childrenIds: [3],
    phone: "(21) 99999-3333",
    email: "jose.oliveira@email.com"
  },
  {
    id: 8,
    username: "lucia.lima",
    password: "123456",
    type: "parent",
    schoolId: 3,
    name: "Lúcia Lima",
    childrenIds: [4],
    phone: "(13) 99999-4444",
    email: "lucia.lima@email.com"
  },

  // DIRETORES
  {
    id: 9,
    username: "diretor.sp",
    password: "123456",
    type: "director",
    schoolId: 1,
    name: "Dr. Roberto Lima",
    email: "roberto.lima@colegiosaopaulo.edu.br",
    phone: "(11) 1234-5678"
  },
  {
    id: 10,
    username: "diretor.rj",
    password: "123456",
    type: "director",
    schoolId: 2,
    name: "Dra. Fernanda Costa",
    email: "fernanda.costa@escoladompedro.edu.br",
    phone: "(21) 9876-5432"
  },
  {
    id: 11,
    username: "diretor.santos",
    password: "123456",
    type: "director",
    schoolId: 3,
    name: "Prof. Marcos Rocha",
    email: "marcos.rocha@institutosantos.edu.br",
    phone: "(13) 5555-1234"
  }
];

export const subjects = [
  "Matemática", "Português", "História", "Geografia", "Ciências", 
  "Inglês", "Educação Física", "Artes", "Química", "Física", "Biologia"
];

export const grades = [
  // João Silva (id: 1)
  { studentId: 1, subject: "Matemática", grade: 8.5, quarter: "1º Bimestre", year: 2025 },
  { studentId: 1, subject: "Português", grade: 9.0, quarter: "1º Bimestre", year: 2025 },
  { studentId: 1, subject: "História", grade: 7.5, quarter: "1º Bimestre", year: 2025 },
  { studentId: 1, subject: "Geografia", grade: 8.0, quarter: "1º Bimestre", year: 2025 },
  { studentId: 1, subject: "Ciências", grade: 9.2, quarter: "1º Bimestre", year: 2025 },
  { studentId: 1, subject: "Inglês", grade: 7.8, quarter: "1º Bimestre", year: 2025 },

  // Maria Santos (id: 2)
  { studentId: 2, subject: "Matemática", grade: 7.0, quarter: "1º Bimestre", year: 2025 },
  { studentId: 2, subject: "Português", grade: 8.8, quarter: "1º Bimestre", year: 2025 },
  { studentId: 2, subject: "História", grade: 9.5, quarter: "1º Bimestre", year: 2025 },
  { studentId: 2, subject: "Geografia", grade: 8.3, quarter: "1º Bimestre", year: 2025 },
  { studentId: 2, subject: "Ciências", grade: 7.7, quarter: "1º Bimestre", year: 2025 },
  { studentId: 2, subject: "Inglês", grade: 8.9, quarter: "1º Bimestre", year: 2025 },

  // Pedro Oliveira (id: 3)
  { studentId: 3, subject: "Matemática", grade: 9.2, quarter: "1º Bimestre", year: 2025 },
  { studentId: 3, subject: "Português", grade: 8.0, quarter: "1º Bimestre", year: 2025 },
  { studentId: 3, subject: "História", grade: 8.7, quarter: "1º Bimestre", year: 2025 },
  { studentId: 3, subject: "Geografia", grade: 9.0, quarter: "1º Bimestre", year: 2025 },
  { studentId: 3, subject: "Ciências", grade: 8.5, quarter: "1º Bimestre", year: 2025 },

  // Ana Lima (id: 4)
  { studentId: 4, subject: "Matemática", grade: 8.8, quarter: "1º Bimestre", year: 2025 },
  { studentId: 4, subject: "Português", grade: 9.3, quarter: "1º Bimestre", year: 2025 },
  { studentId: 4, subject: "História", grade: 7.9, quarter: "1º Bimestre", year: 2025 },
  { studentId: 4, subject: "Geografia", grade: 8.6, quarter: "1º Bimestre", year: 2025 },
  { studentId: 4, subject: "Ciências", grade: 9.1, quarter: "1º Bimestre", year: 2025 }
];

export const attendance = [
  {
    studentId: 1,
    totalClasses: 80,
    attendedClasses: 76,
    absences: 4,
    attendanceRate: 95.0
  },
  {
    studentId: 2,
    totalClasses: 80,
    attendedClasses: 78,
    absences: 2,
    attendanceRate: 97.5
  },
  {
    studentId: 3,
    totalClasses: 80,
    attendedClasses: 80,
    absences: 0,
    attendanceRate: 100.0
  },
  {
    studentId: 4,
    totalClasses: 80,
    attendedClasses: 75,
    absences: 5,
    attendanceRate: 93.8
  }
];

export const bills = [
  // João Silva (id: 1)
  {
    id: 1,
    studentId: 1,
    month: "Outubro 2025",
    amount: 850.00,
    dueDate: "2025-10-10",
    status: "pending",
    barCode: "34191.79001 01043.510047 91020.150008 2 96610000085000",
    description: "Mensalidade Escolar"
  },
  {
    id: 2,
    studentId: 1,
    month: "Setembro 2025",
    amount: 850.00,
    dueDate: "2025-09-10",
    status: "paid",
    barCode: "34191.79001 01043.510047 91020.150008 1 96610000085000",
    description: "Mensalidade Escolar",
    paidDate: "2025-09-08"
  },
  {
    id: 3,
    studentId: 1,
    month: "Novembro 2025",
    amount: 850.00,
    dueDate: "2025-11-10",
    status: "pending",
    barCode: "34191.79001 01043.510047 91020.150008 3 96610000085000",
    description: "Mensalidade Escolar"
  },

  // Maria Santos (id: 2)
  {
    id: 4,
    studentId: 2,
    month: "Outubro 2025",
    amount: 750.00,
    dueDate: "2025-10-10",
    status: "pending",
    barCode: "34191.79001 01043.510047 91020.150008 4 96610000075000",
    description: "Mensalidade Escolar"
  },
  {
    id: 5,
    studentId: 2,
    month: "Setembro 2025",
    amount: 750.00,
    dueDate: "2025-09-10",
    status: "paid",
    barCode: "34191.79001 01043.510047 91020.150008 5 96610000075000",
    description: "Mensalidade Escolar",
    paidDate: "2025-09-05"
  },

  // Pedro Oliveira (id: 3)
  {
    id: 6,
    studentId: 3,
    month: "Outubro 2025",
    amount: 0.00, // Escola pública
    dueDate: "2025-10-10",
    status: "not_applicable",
    description: "Escola Pública - Sem mensalidade"
  },

  // Ana Lima (id: 4)
  {
    id: 7,
    studentId: 4,
    month: "Outubro 2025",
    amount: 950.00,
    dueDate: "2025-10-10",
    status: "overdue",
    barCode: "34191.79001 01043.510047 91020.150008 6 96610000095000",
    description: "Mensalidade Escolar"
  }
];

export const enrollmentPeriods = [
  {
    id: 1,
    schoolId: 1,
    year: 2026,
    startDate: "2025-10-01",
    endDate: "2025-12-15",
    isOpen: true,
    description: "Rematrícula para o ano letivo de 2026"
  },
  {
    id: 2,
    schoolId: 2,
    year: 2026,
    startDate: "2025-10-15",
    endDate: "2025-12-30",
    isOpen: true,
    description: "Rematrícula para o ano letivo de 2026"
  },
  {
    id: 3,
    schoolId: 3,
    year: 2026,
    startDate: "2025-09-15",
    endDate: "2025-11-30",
    isOpen: true,
    description: "Rematrícula para o ano letivo de 2026"
  }
];

export const enrollments = [
  {
    id: 1,
    studentId: 1,
    year: 2026,
    status: "pending", // pending, confirmed, expired
    requestDate: "2025-09-20",
    documents: [
      { name: "RG do Aluno", status: "ok" },
      { name: "CPF do Aluno", status: "ok" },
      { name: "Comprovante de Residência", status: "pending" },
      { name: "Histórico Escolar", status: "ok" }
    ]
  },
  {
    id: 2,
    studentId: 2,
    year: 2026,
    status: "confirmed",
    requestDate: "2025-09-18",
    confirmDate: "2025-09-25",
    documents: [
      { name: "RG do Aluno", status: "ok" },
      { name: "CPF do Aluno", status: "ok" },
      { name: "Comprovante de Residência", status: "ok" },
      { name: "Histórico Escolar", status: "ok" }
    ]
  }
];

// Configurações de acesso por tipo de usuário
export const userPermissions = {
  student: {
    canView: ['grades', 'attendance', 'schedule', 'announcements'],
    canAccess: ['bulletin', 'attendance_report']
  },
  parent: {
    canView: ['grades', 'attendance', 'bills', 'enrollment', 'schedule', 'announcements'],
    canAccess: ['bulletin', 'attendance_report', 'bills', 'enrollment', 'payment']
  },
  director: {
    canView: ['all_students', 'grades', 'attendance', 'bills', 'enrollment', 'reports'],
    canAccess: ['manage_grades', 'manage_attendance', 'manage_enrollment', 'generate_reports'],
    canControl: ['release_bulletin', 'approve_enrollment', 'send_announcements']
  }
};

// Horários das aulas
export const schedules = [
  {
    studentId: 1,
    className: "3º Ano A",
    schedule: [
      { day: "Segunda-feira", time: "07:30 - 08:20", subject: "Matemática", teacher: "Prof. Carlos" },
      { day: "Segunda-feira", time: "08:20 - 09:10", subject: "Português", teacher: "Profa. Ana" },
      { day: "Segunda-feira", time: "09:30 - 10:20", subject: "História", teacher: "Prof. João" },
      { day: "Segunda-feira", time: "10:20 - 11:10", subject: "Geografia", teacher: "Profa. Maria" },
      { day: "Terça-feira", time: "07:30 - 08:20", subject: "Ciências", teacher: "Prof. Pedro" },
      { day: "Terça-feira", time: "08:20 - 09:10", subject: "Inglês", teacher: "Profa. Sarah" },
      { day: "Terça-feira", time: "09:30 - 10:20", subject: "Educação Física", teacher: "Prof. Bruno" },
      { day: "Terça-feira", time: "10:20 - 11:10", subject: "Artes", teacher: "Profa. Carla" }
    ]
  },
  {
    studentId: 2,
    className: "2º Ano B",
    schedule: [
      { day: "Segunda-feira", time: "07:30 - 08:20", subject: "Português", teacher: "Profa. Ana" },
      { day: "Segunda-feira", time: "08:20 - 09:10", subject: "Matemática", teacher: "Prof. Carlos" },
      { day: "Segunda-feira", time: "09:30 - 10:20", subject: "Ciências", teacher: "Prof. Pedro" },
      { day: "Segunda-feira", time: "10:20 - 11:10", subject: "História", teacher: "Prof. João" },
      { day: "Terça-feira", time: "07:30 - 08:20", subject: "Geografia", teacher: "Profa. Maria" },
      { day: "Terça-feira", time: "08:20 - 09:10", subject: "Inglês", teacher: "Profa. Sarah" },
      { day: "Terça-feira", time: "09:30 - 10:20", subject: "Artes", teacher: "Profa. Carla" },
      { day: "Terça-feira", time: "10:20 - 11:10", subject: "Educação Física", teacher: "Prof. Bruno" }
    ]
  }
];

// Comunicados e avisos
export const announcements = [
  {
    id: 1,
    schoolId: 1,
    title: "Reunião de Pais - Outubro 2025",
    content: "Prezados pais e responsáveis, informamos que será realizada reunião de pais no dia 20/10/2025 às 19h no auditório da escola. A presença é fundamental para discutirmos o desenvolvimento dos alunos.",
    date: "2025-09-25",
    priority: "high",
    targetAudience: ["parent", "student"],
    author: "Direção"
  },
  {
    id: 2,
    schoolId: 1,
    title: "Feira de Ciências 2025",
    content: "Está chegando nossa tradicional Feira de Ciências! O evento acontecerá no dia 12/10/2025. Os alunos devem preparar seus projetos com antecedência. Mais informações com os professores de Ciências.",
    date: "2025-09-20",
    priority: "medium",
    targetAudience: ["student", "parent"],
    author: "Coordenação Pedagógica"
  },
  {
    id: 3,
    schoolId: 1,
    title: "Alteração no Cardápio da Cantina",
    content: "A partir da próxima semana, teremos novos itens no cardápio da cantina, incluindo opções mais saudáveis e lanches integrais. Confira o novo cardápio no mural da escola.",
    date: "2025-09-28",
    priority: "low",
    targetAudience: ["student"],
    author: "Administração"
  },
  {
    id: 4,
    schoolId: 2,
    title: "Período de Rematrícula",
    content: "As rematrículas para 2026 estão abertas! Período: 15/10 a 30/12/2025. Compareça à secretaria com os documentos necessários. Não deixe para a última hora!",
    date: "2025-09-15",
    priority: "high",
    targetAudience: ["parent"],
    author: "Secretaria"
  }
];

// Dados financeiros para relatórios do diretor
export const financialData = [
  {
    schoolId: 1,
    month: "2025-09",
    totalRevenue: 425000.00,
    totalExpenses: 380000.00,
    pendingPayments: 45000.00,
    overduePayments: 12000.00,
    studentsWithDelayedPayment: 23
  },
  {
    schoolId: 2, 
    month: "2025-09",
    totalRevenue: 0.00, // Escola pública
    totalExpenses: 180000.00,
    governmentFunding: 200000.00,
    pendingPayments: 0.00
  }
];

// Relatórios e estatísticas
export const schoolReports = [
  {
    schoolId: 1,
    reportType: "academic",
    data: {
      totalStudents: 847,
      approvalRate: 94.2,
      averageGrade: 7.8,
      attendanceRate: 96.5,
      teacherSatisfaction: 4.7,
      parentSatisfaction: 4.5
    }
  },
  {
    schoolId: 1,
    reportType: "financial",
    data: {
      monthlyRevenue: 425000,
      overdueRate: 2.7,
      collectionEfficiency: 97.3,
      operationalCosts: 380000
    }
  }
];

// Configurações da escola (liberação de boletim, etc.)
export const schoolSettings = [
  {
    schoolId: 1,
    bulletinReleased: true,
    currentQuarter: "1º Bimestre",
    academicYear: 2025,
    enrollmentOpen: true
  },
  {
    schoolId: 2,
    bulletinReleased: false,
    currentQuarter: "1º Bimestre", 
    academicYear: 2025,
    enrollmentOpen: true
  },
  {
    schoolId: 3,
    bulletinReleased: true,
    currentQuarter: "1º Bimestre",
    academicYear: 2025,
    enrollmentOpen: true
  }
];