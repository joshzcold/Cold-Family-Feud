package api

import (
	"fmt"
	"math/rand"
	"testing"
	"time"
)

func TestPingIntervalPanic(t *testing.T) {
	server, _, cleanup := setupTestServer(t)
	defer cleanup()

	panicOccurred := false

	// Loop to increase the chance of hitting the condition.
	for i := 0; i < 1000; i++ {
		conn, err := createTestConnection(t, server.URL)
		if err != nil {
			t.Fatalf("Failed to create test connection: %v", err)
		}

		// Wait a *very* short time to allow goroutines to start.  Too long, and the
		// normal unregister process might happen. Too short, and pingInterval
		// might not have started
		randomSleep := time.Duration(rand.Intn(20)) * time.Millisecond
		time.Sleep(randomSleep)

		// abruptly close the connection.
		conn.Close()

		// check for panic
		select {
		case <-time.After(100 * time.Millisecond):
			// no panic...
		}
		time.Sleep(10 * time.Millisecond)
	}
	fmt.Println("Test finished.")

	if !panicOccurred {
		t.Error("Expected panic to occur at least once, but it didn't.")
	}
}
