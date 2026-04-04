# Components

Total: 35 components

| Name | Path | Lines | Client | Local Deps |
|------|------|-------|--------|------------|
| GlitchText | app\components\GlitchText.tsx | 47 | ✓ |  |
| GlobalAnimatedBackground | app\components\GlobalAnimatedBackground.tsx | 263 | ✓ |  |
| NeonCard | app\components\NeonCard.tsx | 59 | ✓ |  |
| ParticleBackground | app\components\ParticleBackground.tsx | 182 | ✓ |  |
| ParticleField | app\components\ParticleField.tsx | 246 | ✓ |  |
| AchievementsCard | app\components\project-modal\AchievementsCard.tsx | 55 | ✓ | @/app/types/content |
| BentoGrid | app\components\project-modal\BentoGrid.tsx | 144 | ✓ | @/app/types/content, ./HeroCard, ./TitleInfoCard... |
| DescriptionCard | app\components\project-modal\DescriptionCard.tsx | 33 | ✓ | @/app/types/content |
| DetailsCard | app\components\project-modal\DetailsCard.tsx | 50 | ✓ | @/app/types/content |
| HeroCard | app\components\project-modal\HeroCard.tsx | 117 | ✓ | @/app/types/content, ./iconMap |
| index | app\components\project-modal\index.tsx | 85 | ✓ | @/app/types/content, ./ModalHeader, ./BentoGrid |
| ModalHeader | app\components\project-modal\ModalHeader.tsx | 34 | ✓ | @/app/types/content |
| QuickInfoCard | app\components\project-modal\QuickInfoCard.tsx | 51 | ✓ | @/app/types/content |
| TechStackCard | app\components\project-modal\TechStackCard.tsx | 53 | ✓ | @/app/types/content |
| TitleInfoCard | app\components\project-modal\TitleInfoCard.tsx | 62 | ✓ | @/app/types/content, ./iconMap |
| ProjectCard | app\components\ProjectCard.tsx | 100 | ✓ |  |
| ScrollIndicator | app\components\ScrollIndicator.tsx | 28 | ✓ |  |
| ContentProvider | app\ContentProvider.tsx | 58 | ✓ |  |
| DynamicForm | app\edit\components\DynamicForm.tsx | 114 | ✓ | ../schema, ./FormFields/TextInput, ./FormFields/NumberInput... |
| ArrayInput | app\edit\components\FormFields\ArrayInput.tsx | 504 | ✓ | ../../schema |
| NumberInput | app\edit\components\FormFields\NumberInput.tsx | 33 | ✓ | ../../schema |
| ObjectInput | app\edit\components\FormFields\ObjectInput.tsx | 50 | ✓ | ../DynamicForm, ../../schema |
| TextArea | app\edit\components\FormFields\TextArea.tsx | 33 | ✓ | ../../schema |
| TextInput | app\edit\components\FormFields\TextInput.tsx | 33 | ✓ | ../../schema |
| page | app\edit\page.tsx | 187 | ✓ | ./schema, ./components/DynamicForm |
| schema | app\edit\schema.tsx | 307 |  |  |
| layout | app\layout.tsx | 25 |  | ./ContentProvider |
| page | app\page.tsx | 50 | ✓ | ./hooks/useSmoothScroll, ./sections/Hero, ./sections/About... |
| About | app\sections\About.tsx | 369 | ✓ | ../config/content, ../ContentProvider |
| Contact | app\sections\Contact.tsx | 512 | ✓ | ../config/content |
| Experience | app\sections\Experience.tsx | 333 | ✓ |  |
| Footer | app\sections\Footer.tsx | 117 | ✓ | ../config/content |
| Hero | app\sections\Hero.tsx | 173 | ✓ | ../hooks/useMousePosition, ../config/content, ../ContentProvider |
| Projects | app\sections\Projects.tsx | 515 |  | ../config/content, ../ContentProvider, ../components/project-modal... |
| Skills | app\sections\Skills.tsx | 483 | ✓ | ../config/content |