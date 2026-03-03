import { renderHook } from "@testing-library/react-native";

// Mock WebSocket
class MockWebSocket {
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  sentMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
    // Simulate connection after microtask
    setTimeout(() => this.onopen?.(), 0);
  }

  send(data: string) {
    this.sentMessages.push(data);
  }

  close() {
    this.onclose?.();
  }

  static instances: MockWebSocket[] = [];
  static clear() {
    MockWebSocket.instances = [];
  }
}

(global as any).WebSocket = MockWebSocket;

// Must import after WebSocket mock
import { useGroupSocket } from "../../hooks/useGroupSocket";

describe("useGroupSocket", () => {
  beforeEach(() => {
    MockWebSocket.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not connect when groupId is null", () => {
    const { unmount } = renderHook(() => useGroupSocket(null));

    expect(MockWebSocket.instances).toHaveLength(0);
    unmount();
  });

  it("connects when groupId is provided", () => {
    const { unmount } = renderHook(() => useGroupSocket("group-1"));

    expect(MockWebSocket.instances).toHaveLength(1);
    expect(MockWebSocket.instances[0].url).toContain("/ws");
    unmount();
  });

  it("sends join_group message on open", () => {
    const { unmount } = renderHook(() => useGroupSocket("group-1"));

    const ws = MockWebSocket.instances[0];

    // Trigger onopen
    jest.runAllTimers();

    expect(ws.sentMessages).toHaveLength(1);
    expect(JSON.parse(ws.sentMessages[0])).toEqual({
      type: "join_group",
      groupId: "group-1",
    });
    unmount();
  });

  it("calls onMessage for deuce_logged events", () => {
    const onMessage = jest.fn();
    const { unmount } = renderHook(() => useGroupSocket("group-1", onMessage));

    const ws = MockWebSocket.instances[0];

    // Simulate a message
    ws.onmessage?.({
      data: JSON.stringify({
        type: "deuce_logged",
        message: "New log",
        entry: { id: "1" },
        userId: "u1",
      }),
    });

    expect(onMessage).toHaveBeenCalledWith({
      type: "deuce_logged",
      message: "New log",
      entry: { id: "1" },
      userId: "u1",
    });
    unmount();
  });

  it("ignores non-deuce_logged events", () => {
    const onMessage = jest.fn();
    const { unmount } = renderHook(() => useGroupSocket("group-1", onMessage));

    const ws = MockWebSocket.instances[0];

    ws.onmessage?.({
      data: JSON.stringify({ type: "other_event", data: {} }),
    });

    expect(onMessage).not.toHaveBeenCalled();
    unmount();
  });

  it("ignores malformed JSON messages", () => {
    const onMessage = jest.fn();
    const { unmount } = renderHook(() => useGroupSocket("group-1", onMessage));

    const ws = MockWebSocket.instances[0];

    // Should not throw
    expect(() => {
      ws.onmessage?.({ data: "not-valid-json{{{" });
    }).not.toThrow();

    expect(onMessage).not.toHaveBeenCalled();
    unmount();
  });

  it("closes WebSocket on unmount", () => {
    const { unmount } = renderHook(() => useGroupSocket("group-1"));

    const ws = MockWebSocket.instances[0];
    const closeSpy = jest.spyOn(ws, "close");

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });
});
