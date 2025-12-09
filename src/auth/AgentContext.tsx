import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type Agent = {
  id: string;
  name: string;
  shop: string;
};

const initialAgents: Agent[] = [
  { id: 'a1', name: 'Avery Quinn', shop: 'Midtown Tailors' },
  { id: 'a2', name: 'Kai Morgan', shop: 'Soho Atelier' },
  { id: 'a3', name: 'Riley Chen', shop: 'Uptown Stitch' }
];

type AgentContextValue = {
  agents: Agent[];
  selectedAgent: Agent;
  setSelectedAgent: (agentId: string) => void;
};

const AgentContext = createContext<AgentContextValue | undefined>(undefined);

export const AgentProvider = ({ children }: PropsWithChildren) => {
  const [agents] = useState(initialAgents);
  const [selectedAgentId, setSelectedAgentId] = useState(initialAgents[0].id);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0],
    [agents, selectedAgentId]
  );

  const value = useMemo(
    () => ({ agents, selectedAgent, setSelectedAgent: setSelectedAgentId }),
    [agents, selectedAgent]
  );

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
};
