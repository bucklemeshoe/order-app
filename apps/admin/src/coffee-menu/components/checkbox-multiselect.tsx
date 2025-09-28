import { Checkbox as BaseCheckbox } from "./ui/checkbox"
import { Label as BaseLabel } from "./ui/label"
import { withInspector } from "../../lib/inspector"

// Create inspectable versions of components
const Checkbox = withInspector(BaseCheckbox, 'Checkbox')
const Label = withInspector(BaseLabel, 'Label')

interface CheckboxMultiSelectProps {
  label: string
  options: string[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  htmlFor?: string
}

export function CheckboxMultiSelect({
  label,
  options,
  selectedValues,
  onSelectionChange,
  htmlFor = "checkbox-group"
}: CheckboxMultiSelectProps) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedValues, option])
    } else {
      onSelectionChange(selectedValues.filter((value) => value !== option))
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
            />
            <Label htmlFor={option} className="text-sm font-normal">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

// Create inspectable version of CheckboxMultiSelect
export const InspectableCheckboxMultiSelect = withInspector(
  CheckboxMultiSelect,
  'CheckboxMultiSelect',
  'checkbox-multiselect.tsx (coffee-menu component)',
  'apps/admin/src/coffee-menu/components/checkbox-multiselect.tsx',
  17
)
