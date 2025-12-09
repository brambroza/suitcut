import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAgent } from '../auth/AgentContext';

const AgentSelector = () => {
  const { agents, selectedAgent, setSelectedAgent } = useAgent();

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="agent-select">Sales Agent</InputLabel>
      <Select
        labelId="agent-select"
        label="Sales Agent"
        value={selectedAgent.id}
        onChange={(event) => setSelectedAgent(event.target.value)}
      >
        {agents.map((agent) => (
          <MenuItem key={agent.id} value={agent.id}>
            {agent.name} — {agent.shop}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AgentSelector;
