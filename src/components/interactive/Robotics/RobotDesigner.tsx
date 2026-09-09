import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Battery,
  Brain,
  Check,
  CheckCircle,
  HelpCircle,
  Cpu,
  Eye,
  Lightbulb,
  RotateCcw,
  Shield,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react';

import {
  ROBOT_PARTS,
  type RobotPart,
  type RobotPartType,
} from './roboticsData';

/* =========================================================
   TYPES
   ========================================================= */

type DesignerMode =
  | 'build'
  | 'inspect'
  | 'validate'
  | 'complete';

type BuildCategory =
  | 'body'
  | 'brain'
  | 'power'
  | 'sensor'
  | 'actuator'
  | 'output'
  | 'communication';

interface CategoryConfig {
  id: BuildCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
}

/* =========================================================
   CONFIGURATION
   ========================================================= */

const BUDGET = 100;

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'body',
    label: 'Body',
    description: 'The structure that holds the robot together.',
    icon: <Shield className="w-4 h-4" />,
  },
  {
    id: 'brain',
    label: 'Brain',
    description: 'Processes instructions and controls the robot.',
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: 'power',
    label: 'Power',
    description: 'Provides energy for the robot.',
    icon: <Battery className="w-4 h-4" />,
  },
  {
    id: 'sensor',
    label: 'Sensors',
    description: 'Help the robot gather information.',
    icon: <Eye className="w-4 h-4" />,
  },
  {
    id: 'actuator',
    label: 'Movement',
    description: 'Allows the robot to move or manipulate objects.',
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    id: 'output',
    label: 'Output',
    description: 'Lets the robot communicate or show information.',
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Allows the robot to communicate with other systems.',
    icon: <Cpu className="w-4 h-4" />,
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

const getCategoryParts = (
  category: BuildCategory
): RobotPart[] => {
  return ROBOT_PARTS.filter(
    (part) => part.type === category
  );
};

const getPartTypeLabel = (
  type: RobotPartType
): string => {
  const labels: Record<RobotPartType, string> = {
    body: 'Body',
    brain: 'Brain',
    power: 'Power',
    sensor: 'Sensor',
    actuator: 'Actuator',
    output: 'Output',
    communication: 'Communication',
    accessory: 'Accessory',
  };

  return labels[type];
};

/* =========================================================
   COMPONENT
   ========================================================= */

export const RobotDesigner: React.FC = () => {
  const [mode, setMode] = useState<DesignerMode>('build');

  const [selectedParts, setSelectedParts] =
    useState<string[]>([]);

  const [activeCategory, setActiveCategory] =
    useState<BuildCategory>('body');

  const [inspectedPart, setInspectedPart] =
    useState<RobotPart | null>(null);

  const [feedback, setFeedback] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const [engineeringXP, setEngineeringXP] =
    useState(0);

  /* =======================================================
     SELECTED PARTS
     ======================================================= */

  const selectedPartObjects = useMemo(() => {
    return selectedParts
      .map((id) =>
        ROBOT_PARTS.find(
          (part) => part.id === id
        )
      )
      .filter(
        (part): part is RobotPart =>
          Boolean(part)
      );
  }, [selectedParts]);

  const totalCost = useMemo(() => {
    return selectedPartObjects.reduce(
      (total, part) => total + part.cost,
      0
    );
  }, [selectedPartObjects]);

  const remainingBudget =
    BUDGET - totalCost;

  /* =======================================================
     ROBOT SYSTEM ANALYSIS
     ======================================================= */

  const hasBody = selectedPartObjects.some(
    (part) => part.type === 'body'
  );

  const hasBrain = selectedPartObjects.some(
    (part) => part.type === 'brain'
  );

  const hasPower = selectedPartObjects.some(
    (part) => part.type === 'power'
  );

  const hasSensor = selectedPartObjects.some(
    (part) => part.type === 'sensor'
  );

  const hasActuator = selectedPartObjects.some(
    (part) => part.type === 'actuator'
  );

  const hasOutput = selectedPartObjects.some(
    (part) => part.type === 'output'
  );

  const hasCommunication =
    selectedPartObjects.some(
      (part) => part.type === 'communication'
    );

  const canSense =
    hasSensor;

  const canThink =
    hasBrain;

  const canAct =
    hasActuator || hasOutput;

  const canOperate =
    hasBody &&
    hasBrain &&
    hasPower;

  const canMove =
    hasBody &&
    hasBrain &&
    hasPower &&
    hasActuator;

  const isSmartRobot =
    canSense &&
    canThink &&
    canAct;

  const isCompleteRobot =
    canOperate &&
    canMove;

  /* =======================================================
     PART MANAGEMENT
     ======================================================= */

  const addPart = (part: RobotPart) => {
    if (selectedParts.includes(part.id)) {
      return;
    }

    if (
      totalCost + part.cost >
      BUDGET
    ) {
      setFeedback('error');
      return;
    }

    setSelectedParts(
      (previous) => [
        ...previous,
        part.id,
      ]
    );

    setFeedback('idle');
  };

  const removePart = (
    partId: string
  ) => {
    setSelectedParts(
      (previous) =>
        previous.filter(
          (id) => id !== partId
        )
    );

    setFeedback('idle');
  };

  const inspectPart = (
    part: RobotPart
  ) => {
    setInspectedPart(part);
    setMode('inspect');
  };

  /* =======================================================
     VALIDATION
     ======================================================= */

  const validateRobot = () => {
    if (!hasBody) {
      setFeedback('error');
      return;
    }

    if (!hasBrain) {
      setFeedback('error');
      return;
    }

    if (!hasPower) {
      setFeedback('error');
      return;
    }

    if (!hasActuator) {
      setFeedback('error');
      return;
    }

    setFeedback('success');
    setEngineeringXP(
      (previous) =>
        previous + 25
    );

    setMode('validate');
  };

  /* =======================================================
     RESET
     ======================================================= */

  const resetDesigner = () => {
    setSelectedParts([]);
    setActiveCategory('body');
    setInspectedPart(null);
    setFeedback('idle');
    setEngineeringXP(0);
    setMode('build');
  };

  /* =======================================================
     PROGRESS
     ======================================================= */

  const systemComponents = [
    hasBody,
    hasBrain,
    hasPower,
    hasActuator,
  ];

  const systemProgress =
    (systemComponents.filter(Boolean)
      .length /
      systemComponents.length) *
    100;

  /* =======================================================
     COMPLETION
     ======================================================= */

  if (mode === 'complete') {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="bg-app-card border border-app-border rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            Robot Built Successfully
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            You designed a functioning robotic system
            by combining structure, power, processing
            and movement.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-gray-900 rounded-2xl p-4">
              <Brain className="w-6 h-6 mx-auto mb-2 text-cyan-400" />

              <p className="text-2xl font-bold text-white">
                {engineeringXP}
              </p>

              <p className="text-xs text-gray-500">
                Engineering XP
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
              <Wrench className="w-6 h-6 mx-auto mb-2 text-amber-400" />

              <p className="text-2xl font-bold text-white">
                {selectedParts.length}
              </p>

              <p className="text-xs text-gray-500">
                Parts
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4">
              <Zap className="w-6 h-6 mx-auto mb-2 text-emerald-400" />

              <p className="text-2xl font-bold text-white">
                ${totalCost}
              </p>

              <p className="text-xs text-gray-500">
                Build Cost
              </p>
            </div>
          </div>

          <button
            onClick={resetDesigner}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
          >
            Build Another Robot
          </button>
        </motion.div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
     ======================================================= */

  return (
    <div className="max-w-5xl mx-auto text-white">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Wrench className="w-7 h-7 text-cyan-400" />

            <h2 className="text-2xl font-bold">
              Robot Designer
            </h2>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            Build a robot by understanding how its
            components work together.
          </p>
        </div>

        <button
          onClick={resetDesigner}
          aria-label="Reset robot design"
          className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ENGINEERING PROGRESS */}

      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">
            System Completion
          </span>

          <span className="text-cyan-400 font-bold">
            {Math.round(systemProgress)}%
          </span>
        </div>

        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            animate={{
              width: `${systemProgress}%`,
            }}
          />
        </div>
      </div>

      {/* BUILD STATUS */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <StatusCard
          label="Body"
          complete={hasBody}
        />

        <StatusCard
          label="Brain"
          complete={hasBrain}
        />

        <StatusCard
          label="Power"
          complete={hasPower}
        />

        <StatusCard
          label="Movement"
          complete={hasActuator}
        />

        <StatusCard
          label="Sensing"
          complete={hasSensor}
        />
      </div>

      {/* MODE NAVIGATION */}

      <div className="grid grid-cols-3 gap-2 mb-6">
        <ModeButton
          active={mode === 'build'}
          onClick={() =>
            setMode('build')
          }
          label="Build"
        />

        <ModeButton
          active={mode === 'inspect'}
          onClick={() =>
            setMode('inspect')
          }
          label="Inspect"
        />

        <ModeButton
          active={
            mode === 'validate'
          }
          onClick={() =>
            setMode('validate')
          }
          label="Test Design"
        />
      </div>

      <AnimatePresence mode="wait">
        {/* =================================================
            BUILD
        ================================================= */}

        {mode === 'build' && (
          <motion.div
            key="build"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
          >
            <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5">
              {/* PART LIBRARY */}

              <div className="bg-app-card border border-app-border rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">
                      Component Library
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Select components for your robot.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Budget
                    </p>

                    <p
                      className={`font-bold ${
                        remainingBudget < 0
                          ? 'text-red-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      ${remainingBudget}
                    </p>
                  </div>
                </div>

                {/* CATEGORIES */}

                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                  {CATEGORIES.map(
                    (category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          setActiveCategory(
                            category.id
                          )
                        }
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                          activeCategory ===
                          category.id
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                        }`}
                      >
                        {category.icon}
                        {category.label}
                      </button>
                    )
                  )}
                </div>

                {/* CATEGORY DESCRIPTION */}

                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mb-4">
                  <p className="text-xs text-cyan-300">
                    {
                      CATEGORIES.find(
                        (category) =>
                          category.id ===
                          activeCategory
                      )?.description
                    }
                  </p>
                </div>

                {/* PARTS */}

                <div className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                  {getCategoryParts(
                    activeCategory
                  ).map((part) => {
                    const selected =
                      selectedParts.includes(
                        part.id
                      );

                    const affordable =
                      totalCost +
                        part.cost <=
                      BUDGET;

                    return (
                      <motion.div
                        key={part.id}
                        whileHover={{
                          y: -2,
                        }}
                        className={`rounded-2xl border p-4 transition ${
                          selected
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-gray-800 bg-gray-900/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <button
                            onClick={() =>
                              inspectPart(
                                part
                              )
                            }
                            className="text-4xl hover:scale-105 transition"
                            aria-label={`Inspect ${part.name}`}
                          >
                            {part.emoji}
                          </button>

                          {selected && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>

                        <button
                          onClick={() =>
                            inspectPart(
                              part
                            )
                          }
                          className="text-left mt-3"
                        >
                          <p className="text-sm font-bold">
                            {part.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {getPartTypeLabel(
                              part.type
                            )}
                          </p>
                        </button>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-cyan-400 font-bold">
                            ${part.cost}
                          </span>

                          <button
                            onClick={() =>
                              selected
                                ? removePart(
                                    part.id
                                  )
                                : addPart(
                                    part
                                  )
                            }
                            disabled={
                              !selected &&
                              !affordable
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              selected
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : affordable
                                ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                                : 'bg-gray-800 text-gray-600'
                            }`}
                          >
                            {selected
                              ? 'Remove'
                              : affordable
                              ? 'Add'
                              : 'Too Expensive'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {feedback ===
                  'error' && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-400 font-bold">
                      🔧 Your design needs another
                      component.
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      A functioning robot needs
                      structure, power, processing
                      and a way to act.
                    </p>
                  </div>
                )}
              </div>

              {/* ROBOT ASSEMBLY */}

              <div className="space-y-5">
                <div className="bg-app-card border border-app-border rounded-3xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold">
                        Your Robot
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Assemble the system.
                      </p>
                    </div>

                    <span className="text-sm font-bold text-cyan-400">
                      ${totalCost}
                    </span>
                  </div>

                  <div className="min-h-[240px] rounded-2xl bg-gray-950 border border-gray-800 p-6">
                    {selectedPartObjects.length ===
                    0 ? (
                      <div className="h-full min-h-[200px] flex items-center justify-center text-center">
                        <div>
                          <div className="text-6xl mb-4">
                            🤖
                          </div>

                          <p className="text-sm text-gray-500">
                            Your robot is waiting
                            for components.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-4">
                        {selectedPartObjects.map(
                          (part) => (
                            <motion.button
                              key={part.id}
                              initial={{
                                scale: 0,
                                opacity: 0,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                              }}
                              whileHover={{
                                scale: 1.08,
                              }}
                              onClick={() =>
                                inspectPart(
                                  part
                                )
                              }
                              className="group relative"
                              title={`Inspect ${part.name}`}
                            >
                              <div className="text-5xl">
                                {part.emoji}
                              </div>

                              <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition">
                                <HelpCircle className="w-4 h-4 text-cyan-400" />
                              </div>
                            </motion.button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* BUDGET */}

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-500">
                        Engineering budget
                      </span>

                      <span className="text-cyan-400">
                        ${remainingBudget}{' '}
                        remaining
                      </span>
                    </div>

                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-500"
                        animate={{
                          width: `${Math.min(
                            (totalCost /
                              BUDGET) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={validateRobot}
                    className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold flex items-center justify-center gap-2"
                  >
                    Test My Design
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SYSTEM MODEL */}

                <SystemModel
                  canSense={canSense}
                  canThink={canThink}
                  canAct={canAct}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* =================================================
            INSPECT
        ================================================= */}

        {mode === 'inspect' && (
          <motion.div
            key="inspect"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-app-card border border-app-border rounded-3xl p-6"
          >
            {inspectedPart ? (
              <div className="grid md:grid-cols-[180px_1fr] gap-6">
                <div className="rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center min-h-[180px]">
                  <div className="text-8xl">
                    {inspectedPart.emoji}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                      {getPartTypeLabel(
                        inspectedPart.type
                      )}
                    </span>

                    <span className="text-xs text-gray-500">
                      ${inspectedPart.cost}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold mb-3">
                    {inspectedPart.name}
                  </h3>

                  <p className="text-gray-300 leading-7 mb-5">
                    {
                      inspectedPart.childDescription
                    }
                  </p>

                  <div className="grid md:grid-cols-2 gap-3 mb-5">
                    <InfoBox
                      title="What it does"
                      text={
                        inspectedPart.technicalDescription
                      }
                    />

                    <InfoBox
                      title="Robot function"
                      text={
                        inspectedPart.function
                      }
                    />

                    <InfoBox
                      title="Vocabulary"
                      text={inspectedPart.vocabulary.join(
                        ', '
                      )}
                    />

                    <InfoBox
                      title="Reality"
                      text={
                        inspectedPart.reality
                      }
                    />
                  </div>

                  {inspectedPart.question && (
                    <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-sm font-bold text-cyan-300 mb-2">
                        💡 Think like an engineer
                      </p>

                      <p className="text-sm text-gray-300">
                        {
                          inspectedPart
                            .question
                            .prompt
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        addPart(
                          inspectedPart
                        );
                        setMode('build');
                      }}
                      disabled={
                        selectedParts.includes(
                          inspectedPart.id
                        )
                      }
                      className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 font-bold"
                    >
                      {selectedParts.includes(
                        inspectedPart.id
                      )
                        ? 'Already Added'
                        : 'Add to Robot'}
                    </button>

                    <button
                      onClick={() =>
                        setMode('build')
                      }
                      className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />

                <p className="text-gray-400">
                  Select a component to inspect it.
                </p>

                <button
                  onClick={() =>
                    setMode('build')
                  }
                  className="mt-5 px-5 py-3 rounded-xl bg-cyan-600 font-bold"
                >
                  Browse Components
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* =================================================
            VALIDATE
        ================================================= */}

        {mode === 'validate' && (
          <motion.div
            key="validate"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="bg-app-card border border-app-border rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-7 h-7 text-cyan-400" />

                <div>
                  <h3 className="text-2xl font-bold">
                    Engineering Validation
                  </h3>

                  <p className="text-sm text-gray-400">
                    Can your robot actually function?
                  </p>
                </div>
              </div>

              {/* SYSTEM CHECKS */}

              <div className="space-y-3 mb-6">
                <Requirement
                  label="Robot has a body"
                  description="A physical structure is required."
                  complete={hasBody}
                />

                <Requirement
                  label="Robot has power"
                  description="The system needs an energy source."
                  complete={hasPower}
                />

                <Requirement
                  label="Robot has a brain"
                  description="A controller processes instructions."
                  complete={hasBrain}
                />

                <Requirement
                  label="Robot can act"
                  description="A motor or actuator creates action."
                  complete={hasActuator}
                />

                <Requirement
                  label="Robot can sense"
                  description="Sensors allow the robot to gather information."
                  complete={hasSensor}
                  optional
                />
              </div>

              {/* SENSE THINK ACT */}

              <SystemModel
                canSense={canSense}
                canThink={canThink}
                canAct={canAct}
              />

              {/* FEEDBACK */}

              {feedback === 'success' ? (
                <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle className="w-5 h-5" />

                    Design passes the basic
                    engineering check.
                  </div>

                  <p className="text-sm text-gray-400 mt-2">
                    Your robot has the essential
                    components required for movement.
                  </p>

                  {isSmartRobot && (
                    <p className="text-sm text-cyan-400 mt-3 font-semibold">
                      ⭐ Bonus: Your robot can
                      Sense → Think → Act.
                    </p>
                  )}

                  <button
                    onClick={() =>
                      setMode('complete')
                    }
                    className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold"
                  >
                    Complete Build
                  </button>
                </div>
              ) : (
                <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-amber-400 font-bold">
                    🔧 Your robot needs improvement.
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Check the missing requirements above,
                    then return to Build.
                  </p>

                  <button
                    onClick={() =>
                      setMode('build')
                    }
                    className="w-full mt-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold"
                  >
                    Improve Robot
                  </button>
                </div>
              )}

              {/* ROBOT SUMMARY */}

              <div className="mt-6 p-4 rounded-2xl bg-gray-950 border border-gray-800">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">
                    Components
                  </span>

                  <span className="text-sm font-bold">
                    {selectedParts.length}
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Build cost
                  </span>

                  <span className="text-sm font-bold text-cyan-400">
                    ${totalCost}
                  </span>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    Remaining budget
                  </span>

                  <span className="text-sm font-bold text-emerald-400">
                    ${remainingBudget}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================
   STATUS CARD
   ========================================================= */

interface StatusCardProps {
  label: string;
  complete: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  complete,
}) => {
  return (
    <div
      className={`rounded-xl border p-3 flex items-center gap-2 ${
        complete
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-gray-800 bg-gray-900'
      }`}
    >
      {complete ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <span className="w-4 h-4 rounded-full border border-gray-700" />
      )}

      <span
        className={`text-xs font-semibold ${
          complete
            ? 'text-emerald-400'
            : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

/* =========================================================
   MODE BUTTON
   ========================================================= */

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const ModeButton: React.FC<ModeButtonProps> = ({
  active,
  onClick,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className={`py-3 rounded-xl text-xs font-bold transition ${
        active
          ? 'bg-cyan-500 text-slate-950'
          : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
      }`}
    >
      {label}
    </button>
  );
};

/* =========================================================
   INFO BOX
   ========================================================= */

interface InfoBoxProps {
  title: string;
  text: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  text,
}) => {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
      <p className="text-xs text-cyan-400 font-bold mb-1">
        {title}
      </p>

      <p className="text-xs text-gray-400">
        {text}
      </p>
    </div>
  );
};

/* =========================================================
   REQUIREMENT
   ========================================================= */

interface RequirementProps {
  label: string;
  description: string;
  complete: boolean;
  optional?: boolean;
}

const Requirement: React.FC<
  RequirementProps
> = ({
  label,
  description,
  complete,
  optional,
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border ${
        complete
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : optional
          ? 'border-gray-800 bg-gray-900'
          : 'border-amber-500/20 bg-amber-500/5'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          complete
            ? 'bg-emerald-500/10'
            : 'bg-gray-800'
        }`}
      >
        {complete ? (
          <Check className="w-5 h-5 text-emerald-400" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-gray-600" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">
            {label}
          </p>

          {optional && (
            <span className="text-[10px] uppercase tracking-wider text-gray-600">
              Optional
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   SENSE → THINK → ACT
   ========================================================= */

interface SystemModelProps {
  canSense: boolean;
  canThink: boolean;
  canAct: boolean;
}

const SystemModel: React.FC<
  SystemModelProps
> = ({
  canSense,
  canThink,
  canAct,
}) => {
  return (
    <div className="bg-app-card border border-app-border rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />

        <div>
          <h3 className="font-bold">
            Robot Intelligence
          </h3>

          <p className="text-xs text-gray-500">
            Sense → Think → Act
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <SystemStep
          icon={<Eye className="w-5 h-5" />}
          label="Sense"
          description="Gather information"
          complete={canSense}
        />

        <SystemStep
          icon={<Brain className="w-5 h-5" />}
          label="Think"
          description="Process information"
          complete={canThink}
        />

        <SystemStep
          icon={<Zap className="w-5 h-5" />}
          label="Act"
          description="Perform an action"
          complete={canAct}
        />
      </div>
    </div>
  );
};

/* =========================================================
   SYSTEM STEP
   ========================================================= */

interface SystemStepProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  complete: boolean;
}

const SystemStep: React.FC<
  SystemStepProps
> = ({
  icon,
  label,
  description,
  complete,
}) => {
  return (
    <div
      className={`rounded-2xl p-3 text-center border ${
        complete
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-gray-800 bg-gray-900'
      }`}
    >
      <div
        className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-2 ${
          complete
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-gray-800 text-gray-600'
        }`}
      >
        {icon}
      </div>

      <p
        className={`text-xs font-bold ${
          complete
            ? 'text-emerald-400'
            : 'text-gray-500'
        }`}
      >
        {label}
      </p>

      <p className="text-[10px] text-gray-600 mt-1">
        {description}
      </p>
    </div>
  );
};