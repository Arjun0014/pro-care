// TODO(arjun): replace with real leadership data when client supplies bios and headshots.
// Headshots go in /public/team/. Format: square, minimum 800×800px.

export type TeamMember = {
  name:      string;
  title:     string;
  bio:       string;
  portrait?: string; // path relative to public
};

// TODO(arjun): populate from client's leadership list.
export const team: TeamMember[] = [
  {
    name:    '// TODO: name',
    title:   '// TODO: title',
    bio:     '// TODO: bio',
    portrait: undefined, // TODO: shoot — portrait photography
  },
] as const;
