import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import {
  Input,
  InputContainer,
  type Option,
  Select,
  Textarea,
  ViewText,
} from "@/shared/ui";

type BaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
};

const labelOf = (items: Option[], value: unknown) =>
  items.find((i) => i.value === value)?.text ?? (value ? String(value) : "-");

export function FormText<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  placeholder = "입력",
  type = "text",
}: BaseProps<T> & { placeholder?: string; type?: "text" | "number" | "date" }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputContainer
          title={label}
          required={required && !disabled}
          content={
            disabled ? (
              <ViewText>
                {field.value === "" || field.value == null
                  ? "-"
                  : String(field.value)}
              </ViewText>
            ) : (
              <div>
                <Input
                  type={type}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      type === "number"
                        ? e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                        : e.target.value
                    )
                  }
                  onBlur={field.onBlur}
                  red={!!fieldState.error}
                  placeholder={placeholder}
                  aria-label={label}
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-lampRed">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )
          }
        />
      )}
    />
  );
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputContainer
          title={label}
          required={required && !disabled}
          content={
            disabled ? (
              <ViewText>
                <span className="whitespace-pre-wrap">
                  {field.value || "-"}
                </span>
              </ViewText>
            ) : (
              <div>
                <Textarea
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  red={!!fieldState.error}
                  aria-label={label}
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-lampRed">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )
          }
        />
      )}
    />
  );
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  items,
}: BaseProps<T> & { items: Option[] }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputContainer
          title={label}
          required={required && !disabled}
          content={
            disabled ? (
              <ViewText>{labelOf(items, field.value)}</ViewText>
            ) : (
              <div>
                <Select
                  items={items}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  red={!!fieldState.error}
                  aria-label={label}
                />
                {fieldState.error && (
                  <p className="mt-1 text-xs text-lampRed">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )
          }
        />
      )}
    />
  );
}

/** 품번 — "본오더 품번 - 코드" 두 칸 */
export function FormStyleNumber<T extends FieldValues>({
  control,
  name,
  codeName,
  label,
  required,
  disabled,
}: BaseProps<T> & { codeName: Path<T> }) {
  const number = useController({ control, name });
  const code = useController({ control, name: codeName });
  return (
    <InputContainer
      title={label}
      required={required && !disabled}
      content={
        disabled ? (
          <ViewText>
            {[number.field.value, code.field.value].filter(Boolean).join("-") ||
              "-"}
          </ViewText>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <Input
                value={number.field.value ?? ""}
                onChange={number.field.onChange}
                onBlur={number.field.onBlur}
                red={!!number.fieldState.error}
                placeholder="입력"
                aria-label={label}
              />
              <span className="shrink-0 text-sm text-cool400" aria-hidden>
                -
              </span>
              <Input
                className="w-24"
                value={code.field.value ?? ""}
                onChange={code.field.onChange}
                onBlur={code.field.onBlur}
                aria-label="품번 코드"
              />
            </div>
            {number.fieldState.error && (
              <p className="mt-1 text-xs text-lampRed">
                {number.fieldState.error.message}
              </p>
            )}
          </div>
        )
      }
    />
  );
}

/** 시즌 — SS/FW 셀렉트 + 연도 2자리 */
export function SeasonField<T extends FieldValues>({
  control,
  seasonName,
  yearName,
  items,
  disabled,
}: {
  control: Control<T>;
  seasonName: Path<T>;
  yearName: Path<T>;
  items: Option[];
  disabled?: boolean;
}) {
  const season = useController({ control, name: seasonName });
  const year = useController({ control, name: yearName });
  return (
    <InputContainer
      title="시즌"
      required={!disabled}
      content={
        disabled ? (
          <ViewText>
            {season.field.value
              ? `${season.field.value} ${year.field.value}`
              : "-"}
          </ViewText>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <Select
                className="w-24"
                items={items}
                value={season.field.value ?? ""}
                onChange={season.field.onChange}
                red={!!season.fieldState.error}
                aria-label="시즌"
              />
              <Input
                className="w-20"
                value={year.field.value ?? ""}
                onChange={year.field.onChange}
                onBlur={year.field.onBlur}
                red={!!year.fieldState.error}
                placeholder="YY"
                maxLength={2}
                aria-label="연도"
              />
            </div>
            {(season.fieldState.error ?? year.fieldState.error) && (
              <p className="mt-1 text-xs text-lampRed">
                {(season.fieldState.error ?? year.fieldState.error)!.message}
              </p>
            )}
          </div>
        )
      }
    />
  );
}

export function ReadonlyRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <InputContainer title={label} content={<ViewText>{children}</ViewText>} />
  );
}
