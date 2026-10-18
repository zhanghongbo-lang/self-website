import { getSkills } from "@/lib/content";

const SEGMENTS = 20;

export default function SkillsPage() {
  const groups = getSkills();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">技能</h1>
      <p className="mt-2 text-muted">技术栈与熟练度概览。</p>

      <div className="mt-10 space-y-10">
        {groups.map((group) => (
          <section key={group.group}>
            <h2 className="text-xl font-semibold text-primary">{group.group}</h2>
            <div className="mt-4 space-y-4">
              {group.items.map((skill) => {
                const filled = Math.max(
                  0,
                  Math.min(SEGMENTS, Math.round(skill.level / (100 / SEGMENTS))),
                );
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted">{skill.level}%</span>
                    </div>
                    <div className="mt-1 flex gap-1">
                      {Array.from({ length: SEGMENTS }, (_, index) => (
                        <div
                          key={index}
                          className={
                            index < filled
                              ? "h-2 flex-1 rounded-full bg-primary"
                              : "h-2 flex-1 rounded-full bg-card"
                          }
                        />
                      ))}
                    </div>
                    {skill.note && (
                      <p className="mt-1 text-sm text-muted">{skill.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
