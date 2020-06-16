import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  abs,
  add,
  call,
  clockRunning,
  cond,
  eq,
  lessThan,
  not,
  set,
  useCode,
} from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import {
  clamp,
  snapPoint,
  timing,
  useClock,
  usePanGestureHandler,
  useValue,
} from "react-native-redash";
import ItemLayout, { ItemModel } from "./ItemLayout";

const { width } = Dimensions.get("window");
const snapPoints = [-width, 0];
const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E1E2E3",
  },
});

interface ItemProps {
  item: ItemModel;
}

const Item = ({ item }: ItemProps) => {
  const {
    gestureHandler,
    translation,
    velocity,
    state,
  } = usePanGestureHandler();
  const clock = useClock();
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const to = snapPoint(translateX, velocity.x, snapPoints);
  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(eq(state, State.END), [
        set(translateX, timing({ clock, from: translateX, to })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          cond(
            eq(abs(translateX), width),
            call([], () => alert("bruh!"))
          ),
        ]),
      ]),
    ],
    []
  );
  return (
    <Animated.View>
      <View style={styles.background}>
        <View />
      </View>
      <PanGestureHandler activeOffsetX={[-10, 10]} {...gestureHandler}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <ItemLayout {...{ item }} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default Item;
