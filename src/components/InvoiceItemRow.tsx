import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { InvoiceItem } from "../types/invoice";
import { formatCurrencyVND } from "../utils/format";

type Props = {
  item: InvoiceItem;
  onChangeName: (id: string, value: string) => void;
  onChangePricePerKg: (id: string, value: string) => void;
  onChangeWeightKg: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  hasPresets?: boolean;
  onPressChooseFruit?: (id: string) => void;
};

export const InvoiceItemRow: React.FC<Props> = ({
  item,
  onChangeName,
  onChangePricePerKg,
  onChangeWeightKg,
  onRemove,
  hasPresets,
  onPressChooseFruit,
}) => {
  const lineTotal = item.pricePerKg * item.weightKg;

  const [weightText, setWeightText] = useState(
    item.weightKg || item.weightKg === 0 ? String(item.weightKg) : ""
  );

  useEffect(() => {
    setWeightText(
      item.weightKg || item.weightKg === 0 ? String(item.weightKg) : ""
    );
  }, [item.weightKg]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>

      <View style={styles.mainRow}>
        <View style={styles.leftColumn}>
          {hasPresets && onPressChooseFruit ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.input, styles.nameInput, styles.dropdownInput]}
              onPress={() => onPressChooseFruit(item.id)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !item.name && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {item.name || "Chọn loại quả"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Loại quả"
              value={item.name}
              onChangeText={(text) => onChangeName(item.id, text)}
            />
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá/kg</Text>
            <Text style={styles.priceText}>
              {item.pricePerKg > 0
                ? `${formatCurrencyVND(item.pricePerKg)}`
                : "--"}
            </Text>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.weightLabel}>Số kg</Text>
          <TextInput
            style={[styles.input, styles.weightInput]}
            placeholder="0"
            keyboardType="decimal-pad"
            value={weightText}
            onChangeText={(text) => {
              setWeightText(text);
              onChangeWeightKg(item.id, text);
            }}
          />
          <Text style={styles.totalLabel}>Thành tiền</Text>
          <Text style={styles.totalText}>{formatCurrencyVND(lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 2,
    paddingRight: 8,
  },
  rightColumn: {
    flex: 1.3,
    alignItems: "flex-end",
  },
  label: {
    fontSize: 11,
    color: "#555",
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 0,
    margin: 0,
    fontSize: 13,
  },
  readonlyPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  priceText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#fa541c",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 11,
    color: "#555",
    marginRight: 6,
  },
  priceInput: {
    flex: 0,
    width: 70,
  },
  weightInput: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    minWidth: 70,
  },
  nameInput: {
    flex: 1,
  },
  dropdownInput: {
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#222",
  },
  placeholderText: {
    color: "#999",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ff4d4f",
    opacity: 0,
    pointerEvents: "none",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  weightLabel: {
    fontSize: 11,
    color: "#555",
    marginBottom: 2,
  },
  totalLabel: {
    marginTop: 6,
    fontSize: 11,
    color: "#555",
  },
  totalText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fa541c",
  },
});
