import { ChevronDown, Hash, Volume2 } from "lucide-react";
import { useState } from "react";
import { channelGroups } from "../data";

interface ChannelSidebarProps {
  chatName: string;
  selectedChannelId: string;
  onSelectChannel: (channelId: string) => void;
}

export function ChannelSidebar({
  chatName,
  selectedChannelId,
  onSelectChannel,
}: ChannelSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["1", "2"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((previousGroups) =>
      previousGroups.includes(groupId)
        ? previousGroups.filter((id) => id !== groupId)
        : [...previousGroups, groupId],
    );
  };

  return (
    <div className="flex w-[15%] flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="font-semibold text-zinc-900">{chatName}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">12 members online</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {channelGroups.map((group) => (
          <div key={group.id} className="mb-2">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex w-full items-center gap-1 px-3 py-2 transition-colors hover:bg-zinc-100"
            >
              <ChevronDown
                className={`h-3 w-3 text-zinc-600 transition-transform ${
                  expandedGroups.includes(group.id) ? "" : "-rotate-90"
                }`}
              />
              <span className="text-xs font-semibold text-zinc-600">{group.name}</span>
            </button>

            {expandedGroups.includes(group.id) ? (
              <div className="space-y-0.5">
                {group.channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 pl-6 text-left transition-colors hover:bg-zinc-100 ${
                      selectedChannelId === channel.id ? "bg-zinc-200" : ""
                    }`}
                  >
                    {channel.type === "text" ? (
                      <Hash className="h-4 w-4 text-zinc-500" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-zinc-500" />
                    )}
                    <span className="text-sm text-zinc-700">{channel.name}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
